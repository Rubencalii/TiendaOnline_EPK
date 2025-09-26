const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const { validateReview, validateMongoId } = require('../middleware/validation');
const { uploadReviewImages, getFileUrl } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Obtener reseñas de un producto
// @access  Public
router.get('/product/:productId', validateMongoId('productId'), async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Configurar ordenamiento
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest-rating':
        sortOptions = { rating: -1 };
        break;
      case 'lowest-rating':
        sortOptions = { rating: 1 };
        break;
      case 'most-helpful':
        sortOptions = { helpfulVotes: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
    
    const reviews = await Review.find({ 
      product: req.params.productId, 
      isApproved: true 
    })
      .populate('user', 'firstName lastName avatar')
      .populate('response.respondedBy', 'firstName lastName')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
    
    const total = await Review.countDocuments({ 
      product: req.params.productId, 
      isApproved: true 
    });
    
    // Agregar URLs completas a las imágenes
    const reviewsWithImageUrls = reviews.map(review => {
      const reviewObj = review.toObject();
      if (reviewObj.images && reviewObj.images.length > 0) {
        reviewObj.images = reviewObj.images.map(image => ({
          ...image,
          url: getFileUrl(image.url, req)
        }));
      }
      return reviewObj;
    });
    
    // Obtener estadísticas de calificaciones
    const ratingStats = await Review.aggregate([
      { 
        $match: { 
          product: req.params.productId, 
          isApproved: true 
        } 
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        reviews: reviewsWithImageUrls,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        ratingStats
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/reviews/product/:productId
// @desc    Crear reseña para un producto
// @access  Private
router.post('/product/:productId', auth, validateMongoId('productId'), uploadReviewImages, validateReview, async (req, res) => {
  try {
    const { rating, title, comment, pros, cons } = req.body;
    const productId = req.params.productId;
    
    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Verificar si ya existe una reseña del usuario para este producto
    const existingReview = await Review.findOne({ 
      user: req.user.id, 
      product: productId 
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Ya has escrito una reseña para este producto'
      });
    }
    
    const reviewData = {
      user: req.user.id,
      product: productId,
      rating,
      title,
      comment,
      pros,
      cons
    };
    
    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      reviewData.images = req.files.map((file, index) => ({
        url: file.path.replace(/\\/g, '/'),
        alt: `Reseña ${title} - Imagen ${index + 1}`
      }));
    }
    
    const review = new Review(reviewData);
    await review.save();
    
    res.status(201).json({
      success: true,
      message: 'Reseña enviada correctamente. Será revisada antes de publicarse.',
      data: {
        review: {
          id: review._id,
          rating: review.rating,
          title: review.title,
          isVerifiedPurchase: review.isVerifiedPurchase
        }
      }
    });
    
  } catch (error) {
    console.error('Error creando reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al crear la reseña'
    });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Marcar reseña como útil
// @access  Private
router.post('/:id/helpful', auth, validateMongoId('id'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }
    
    const hasVoted = review.usersWhoVotedHelpful.includes(req.user.id);
    
    if (hasVoted) {
      await review.unmarkAsHelpful(req.user.id);
      res.json({
        success: true,
        message: 'Voto removido',
        data: {
          helpfulVotes: review.helpfulVotes,
          hasVoted: false
        }
      });
    } else {
      await review.markAsHelpful(req.user.id);
      res.json({
        success: true,
        message: 'Marcado como útil',
        data: {
          helpfulVotes: review.helpfulVotes,
          hasVoted: true
        }
      });
    }
    
  } catch (error) {
    console.error('Error marcando reseña como útil:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/reviews/:id/report
// @desc    Reportar reseña
// @access  Private
router.post('/:id/report', auth, validateMongoId('id'), async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'El motivo del reporte es requerido'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }
    
    await review.report(reason);
    
    res.json({
      success: true,
      message: 'Reseña reportada correctamente'
    });
    
  } catch (error) {
    console.error('Error reportando reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// RUTAS ADMIN

// @route   GET /api/reviews/admin/pending
// @desc    Obtener reseñas pendientes de aprobación
// @access  Private (Admin)
router.get('/admin/pending', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const reviews = await Review.find({ isApproved: false, isReported: false })
      .populate('user', 'firstName lastName email')
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Review.countDocuments({ isApproved: false, isReported: false });
    
    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo reseñas pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/reviews/admin/reported
// @desc    Obtener reseñas reportadas
// @access  Private (Admin)
router.get('/admin/reported', auth, authorize('admin'), async (req, res) => {
  try {
    const reviews = await Review.find({ isReported: true })
      .populate('user', 'firstName lastName email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        reviews
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo reseñas reportadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/reviews/:id/approve
// @desc    Aprobar reseña
// @access  Private (Admin)
router.post('/:id/approve', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }
    
    await review.approve();
    
    res.json({
      success: true,
      message: 'Reseña aprobada correctamente'
    });
    
  } catch (error) {
    console.error('Error aprobando reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/reviews/:id/reject
// @desc    Rechazar reseña
// @access  Private (Admin)
router.post('/:id/reject', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const { reason } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }
    
    await review.reject(reason);
    
    res.json({
      success: true,
      message: 'Reseña rechazada correctamente'
    });
    
  } catch (error) {
    console.error('Error rechazando reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/reviews/:id/respond
// @desc    Responder a una reseña
// @access  Private (Admin)
router.post('/:id/respond', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'La respuesta es requerida'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }
    
    await review.addResponse(response, req.user.id);
    
    res.json({
      success: true,
      message: 'Respuesta agregada correctamente'
    });
    
  } catch (error) {
    console.error('Error respondiendo reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;