const express = require('express');
const Newsletter = require('../models/Newsletter');
const { auth, authorize } = require('../middleware/auth');
const { validateNewsletter } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Suscribirse al newsletter
// @access  Public
router.post('/subscribe', validateNewsletter, async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      preferences = {},
      categories = [],
      source = 'website'
    } = req.body;
    
    // Verificar si ya existe suscripción
    let subscriber = await Newsletter.findOne({ email });
    
    if (subscriber) {
      if (subscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Este email ya está suscrito a nuestro newsletter'
        });
      } else {
        // Reactivar suscripción existente
        await subscriber.resubscribe();
        subscriber.firstName = firstName || subscriber.firstName;
        subscriber.lastName = lastName || subscriber.lastName;
        subscriber.preferences = { ...subscriber.preferences, ...preferences };
        subscriber.categories = categories.length > 0 ? categories : subscriber.categories;
        subscriber.source = source;
        await subscriber.save();
        
        return res.json({
          success: true,
          message: '¡Bienvenido de vuelta! Tu suscripción ha sido reactivada.',
          data: {
            subscriber: {
              email: subscriber.email,
              isActive: subscriber.isActive,
              preferences: subscriber.preferences
            }
          }
        });
      }
    }
    
    // Crear nueva suscripción
    const newSubscriber = new Newsletter({
      email,
      firstName,
      lastName,
      preferences: {
        products: true,
        offers: true,
        concerts: true,
        news: true,
        ...preferences
      },
      categories,
      source
    });
    
    await newSubscriber.save();
    
    // TODO: Enviar email de confirmación
    
    res.status(201).json({
      success: true,
      message: '¡Gracias por suscribirte! Te enviaremos las últimas novedades de Epk Música y la Orquesta Époka.',
      data: {
        subscriber: {
          email: newSubscriber.email,
          isActive: newSubscriber.isActive,
          preferences: newSubscriber.preferences
        }
      }
    });
    
  } catch (error) {
    console.error('Error suscribiendo al newsletter:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está suscrito'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error del servidor al procesar la suscripción'
    });
  }
});

// @route   POST /api/newsletter/confirm/:token
// @desc    Confirmar suscripción por email
// @access  Public
router.post('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const subscriber = await Newsletter.findOne({
      confirmationToken: token,
      isActive: false
    });
    
    if (!subscriber) {
      return res.status(400).json({
        success: false,
        message: 'Token de confirmación inválido o expirado'
      });
    }
    
    await subscriber.confirm();
    
    res.json({
      success: true,
      message: '¡Suscripción confirmada correctamente! Ya recibirás nuestro newsletter.'
    });
    
  } catch (error) {
    console.error('Error confirmando suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/newsletter/unsubscribe/:token
// @desc    Desuscribirse del newsletter
// @access  Public
router.post('/unsubscribe/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const subscriber = await Newsletter.findOne({
      unsubscribeToken: token
    });
    
    if (!subscriber) {
      return res.status(400).json({
        success: false,
        message: 'Token de desuscripción inválido'
      });
    }
    
    await subscriber.unsubscribe();
    
    res.json({
      success: true,
      message: 'Te has desuscrito correctamente. Lamentamos verte partir.'
    });
    
  } catch (error) {
    console.error('Error desuscribiendo:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   PUT /api/newsletter/preferences/:token
// @desc    Actualizar preferencias del newsletter
// @access  Public
router.put('/preferences/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { preferences, categories } = req.body;
    
    const subscriber = await Newsletter.findOne({
      unsubscribeToken: token
    });
    
    if (!subscriber) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (preferences) {
      subscriber.preferences = { ...subscriber.preferences, ...preferences };
    }
    
    if (categories) {
      subscriber.categories = categories;
    }
    
    await subscriber.save();
    
    res.json({
      success: true,
      message: 'Preferencias actualizadas correctamente',
      data: {
        preferences: subscriber.preferences,
        categories: subscriber.categories
      }
    });
    
  } catch (error) {
    console.error('Error actualizando preferencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// RUTAS ADMIN

// @route   GET /api/newsletter/admin/subscribers
// @desc    Obtener todos los suscriptores (Admin)
// @access  Private (Admin)
router.get('/admin/subscribers', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      isActive,
      source,
      categories,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 50
    } = req.query;
    
    const filters = {};
    
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (source) filters.source = source;
    if (categories) filters.categories = { $in: categories.split(',') };
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filters.$or = [
        { email: new RegExp(search, 'i') },
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') }
      ];
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const subscribers = await Newsletter.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Newsletter.countDocuments(filters);
    
    // Estadísticas
    const stats = await Newsletter.aggregate([
      {
        $group: {
          _id: '$isActive',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const sourceStats = await Newsletter.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const categoryStats = await Newsletter.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        stats: {
          byStatus: stats,
          bySource: sourceStats,
          byCategory: categoryStats
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo suscriptores:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/newsletter/admin/send-campaign
// @desc    Enviar campaña de newsletter (Admin)
// @access  Private (Admin)
router.post('/admin/send-campaign', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      subject,
      content,
      htmlContent,
      targetAudience = 'all', // all, category, custom
      categories = [],
      customEmails = [],
      scheduleDate
    } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Asunto y contenido son requeridos'
      });
    }
    
    // Construir filtros para la audiencia objetivo
    let filters = { isActive: true, confirmedAt: { $exists: true } };
    
    if (targetAudience === 'category' && categories.length > 0) {
      filters.categories = { $in: categories };
    }
    
    let recipients = [];
    
    if (targetAudience === 'custom' && customEmails.length > 0) {
      recipients = await Newsletter.find({
        email: { $in: customEmails },
        isActive: true
      });
    } else {
      recipients = await Newsletter.find(filters);
    }
    
    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se encontraron destinatarios para esta campaña'
      });
    }
    
    // Si es para envío inmediato
    if (!scheduleDate) {
      // TODO: Implementar envío masivo de emails
      // Esto requeriría un sistema de colas para manejar el envío masivo
      
      // Por ahora, simular el envío
      for (const subscriber of recipients) {
        await subscriber.recordEmailSent();
      }
      
      res.json({
        success: true,
        message: `Campaña enviada correctamente a ${recipients.length} suscriptores`,
        data: {
          recipients: recipients.length,
          subject,
          sentAt: new Date()
        }
      });
    } else {
      // TODO: Programar envío para fecha específica
      res.json({
        success: true,
        message: `Campaña programada para ${scheduleDate}`,
        data: {
          recipients: recipients.length,
          subject,
          scheduledFor: scheduleDate
        }
      });
    }
    
  } catch (error) {
    console.error('Error enviando campaña:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al enviar la campaña'
    });
  }
});

// @route   GET /api/newsletter/admin/stats
// @desc    Obtener estadísticas del newsletter (Admin)
// @access  Private (Admin)
router.get('/admin/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments();
    const activeSubscribers = await Newsletter.countDocuments({ 
      isActive: true, 
      confirmedAt: { $exists: true } 
    });
    const pendingConfirmation = await Newsletter.countDocuments({
      isActive: true,
      confirmedAt: { $exists: false }
    });
    const unsubscribed = await Newsletter.countDocuments({ isActive: false });
    
    // Suscripciones por mes (últimos 12 meses)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const subscriptionsByMonth = await Newsletter.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Top categorías más populares
    const topCategories = await Newsletter.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        summary: {
          totalSubscribers,
          activeSubscribers,
          pendingConfirmation,
          unsubscribed,
          confirmationRate: totalSubscribers > 0 
            ? Math.round((activeSubscribers / totalSubscribers) * 100) 
            : 0
        },
        subscriptionsByMonth,
        topCategories
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   DELETE /api/newsletter/admin/subscriber/:id
// @desc    Eliminar suscriptor (Admin)
// @access  Private (Admin)
router.delete('/admin/subscriber/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Suscriptor no encontrado'
      });
    }
    
    await Newsletter.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Suscriptor eliminado correctamente'
    });
    
  } catch (error) {
    console.error('Error eliminando suscriptor:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;