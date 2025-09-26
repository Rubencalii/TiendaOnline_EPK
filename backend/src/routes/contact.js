const express = require('express');
const Contact = require('../models/Contact');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { validateContact, validateMongoId } = require('../middleware/validation');
const { uploadContactAttachments, getFileUrl } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/contact
// @desc    Enviar mensaje de contacto
// @access  Public
router.post('/', optionalAuth, uploadContactAttachments, validateContact, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      category,
      relatedOrder,
      relatedRental,
      relatedProduct
    } = req.body;
    
    const contactData = {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      category,
      relatedOrder,
      relatedRental,
      relatedProduct,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer')
    };
    
    // Si hay usuario autenticado, determinar tipo de cliente
    if (req.user) {
      contactData.customerType = 'existing';
      // TODO: Implementar lógica para determinar si es VIP o business
    }
    
    // Procesar archivos adjuntos
    if (req.files && req.files.length > 0) {
      contactData.attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: file.path.replace(/\\/g, '/')
      }));
    }
    
    // Detección básica de spam
    const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'million dollars'];
    const messageText = `${subject} ${message}`.toLowerCase();
    let spamScore = 0;
    
    spamKeywords.forEach(keyword => {
      if (messageText.includes(keyword)) {
        spamScore += 20;
      }
    });
    
    // URLs en exceso
    const urlCount = (messageText.match(/http/g) || []).length;
    if (urlCount > 3) spamScore += 30;
    
    // Texto en mayúsculas
    const upperCaseRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (upperCaseRatio > 0.5) spamScore += 25;
    
    contactData.spamScore = Math.min(spamScore, 100);
    contactData.isSpam = spamScore >= 80;
    
    // Asignación automática basada en categoría
    if (category === 'technical-support' || category === 'warranty') {
      contactData.priority = 'high';
    } else if (category === 'complaints') {
      contactData.priority = 'urgent';
    } else if (category === 'general' || category === 'suggestions') {
      contactData.priority = 'low';
    }
    
    const contact = new Contact(contactData);
    await contact.save();
    
    // TODO: Enviar notificación por email al equipo
    // TODO: Enviar confirmación automática al cliente
    
    res.status(201).json({
      success: true,
      message: 'Tu mensaje ha sido enviado correctamente. Te responderemos pronto.',
      data: {
        ticketNumber: contact._id,
        estimatedResponse: contact.estimatedResponseTime
      }
    });
    
  } catch (error) {
    console.error('Error enviando mensaje de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al enviar el mensaje'
    });
  }
});

// @route   GET /api/contact/categories
// @desc    Obtener categorías de contacto disponibles
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    { 
      value: 'general', 
      label: 'Consulta General',
      description: 'Información general sobre productos o servicios'
    },
    { 
      value: 'products', 
      label: 'Productos',
      description: 'Preguntas sobre instrumentos y equipos'
    },
    { 
      value: 'orders', 
      label: 'Pedidos',
      description: 'Estado de pedidos, envíos y facturación'
    },
    { 
      value: 'rentals', 
      label: 'Alquiler de Equipos',
      description: 'Consultas sobre alquiler de sonido e iluminación'
    },
    { 
      value: 'concerts', 
      label: 'Conciertos Orquesta Époka',
      description: 'Información sobre actuaciones y contrataciones'
    },
    { 
      value: 'technical-support', 
      label: 'Soporte Técnico',
      description: 'Ayuda técnica con productos adquiridos'
    },
    { 
      value: 'warranty', 
      label: 'Garantía',
      description: 'Reclamaciones de garantía'
    },
    { 
      value: 'complaints', 
      label: 'Quejas y Reclamaciones',
      description: 'Reportar problemas con productos o servicios'
    },
    { 
      value: 'suggestions', 
      label: 'Sugerencias',
      description: 'Ideas para mejorar nuestros productos o servicios'
    },
    { 
      value: 'partnerships', 
      label: 'Colaboraciones',
      description: 'Propuestas comerciales y colaboraciones'
    },
    { 
      value: 'press', 
      label: 'Prensa',
      description: 'Consultas de medios de comunicación'
    },
    { 
      value: 'other', 
      label: 'Otros',
      description: 'Otros temas no clasificados'
    }
  ];
  
  res.json({
    success: true,
    data: { categories }
  });
});

// RUTAS ADMIN

// @route   GET /api/contact/admin/all
// @desc    Obtener todos los mensajes de contacto (Admin)
// @access  Private (Admin)
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      assignedTo,
      startDate,
      endDate,
      search,
      includeSpam = false,
      page = 1,
      limit = 20
    } = req.query;
    
    const filters = {};
    
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (priority) filters.priority = priority;
    if (assignedTo) filters.assignedTo = assignedTo;
    if (includeSpam !== 'true') filters.isSpam = false;
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filters.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') },
        { message: new RegExp(search, 'i') }
      ];
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const contacts = await Contact.find(filters)
      .populate('assignedTo', 'firstName lastName')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedRental', 'rentalNumber')
      .populate('relatedProduct', 'name')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Contact.countDocuments(filters);
    
    // Estadísticas
    const stats = await Contact.aggregate([
      { $match: { isSpam: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const overdue = await Contact.countDocuments({
      status: { $in: ['new', 'in-progress'] },
      estimatedResponseTime: { $lt: new Date() },
      isSpam: false
    });
    
    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        stats: {
          byStatus: stats,
          overdue
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo mensajes de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/contact/admin/:id
// @desc    Obtener mensaje específico (Admin)
// @access  Private (Admin)
router.get('/admin/:id', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('response.respondedBy', 'firstName lastName')
      .populate('followUps.createdBy', 'firstName lastName')
      .populate('relatedOrder', 'orderNumber status totalAmount')
      .populate('relatedRental', 'rentalNumber status')
      .populate('relatedProduct', 'name category price');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    // Agregar URLs completas a los archivos adjuntos
    const contactWithFileUrls = contact.toObject();
    if (contactWithFileUrls.attachments && contactWithFileUrls.attachments.length > 0) {
      contactWithFileUrls.attachments = contactWithFileUrls.attachments.map(attachment => ({
        ...attachment,
        url: getFileUrl(attachment.url, req)
      }));
    }
    
    res.json({
      success: true,
      data: {
        contact: contactWithFileUrls
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/contact/admin/:id/assign
// @desc    Asignar mensaje a usuario (Admin)
// @access  Private (Admin)
router.post('/admin/:id/assign', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    await contact.assignTo(assignedTo);
    
    res.json({
      success: true,
      message: 'Mensaje asignado correctamente'
    });
    
  } catch (error) {
    console.error('Error asignando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/contact/admin/:id/reply
// @desc    Responder mensaje (Admin)
// @access  Private (Admin)
router.post('/admin/:id/reply', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const { message, method = 'email' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje de respuesta es requerido'
      });
    }
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    await contact.reply(message, req.user.id, method);
    
    // TODO: Enviar email de respuesta al cliente
    
    res.json({
      success: true,
      message: 'Respuesta enviada correctamente'
    });
    
  } catch (error) {
    console.error('Error enviando respuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/contact/admin/:id/follow-up
// @desc    Agregar seguimiento (Admin)
// @access  Private (Admin)
router.post('/admin/:id/follow-up', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const { message, type = 'note' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje de seguimiento es requerido'
      });
    }
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    await contact.addFollowUp(message, req.user.id, type);
    
    res.json({
      success: true,
      message: 'Seguimiento agregado correctamente'
    });
    
  } catch (error) {
    console.error('Error agregando seguimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/contact/admin/:id/resolve
// @desc    Resolver mensaje (Admin)
// @access  Private (Admin)
router.post('/admin/:id/resolve', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const { resolution } = req.body;
    
    if (!resolution) {
      return res.status(400).json({
        success: false,
        message: 'La resolución es requerida'
      });
    }
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    await contact.resolve(resolution);
    
    res.json({
      success: true,
      message: 'Mensaje resuelto correctamente'
    });
    
  } catch (error) {
    console.error('Error resolviendo mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/contact/admin/:id/close
// @desc    Cerrar mensaje (Admin)
// @access  Private (Admin)
router.post('/admin/:id/close', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    await contact.close();
    
    res.json({
      success: true,
      message: 'Mensaje cerrado correctamente'
    });
    
  } catch (error) {
    console.error('Error cerrando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/contact/admin/:id/spam
// @desc    Marcar como spam (Admin)
// @access  Private (Admin)
router.post('/admin/:id/spam', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    await contact.markAsSpam();
    
    res.json({
      success: true,
      message: 'Mensaje marcado como spam'
    });
    
  } catch (error) {
    console.error('Error marcando como spam:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;