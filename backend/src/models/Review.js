const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El producto es obligatorio']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es obligatoria'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5']
  },
  title: {
    type: String,
    required: [true, 'El título de la reseña es obligatorio'],
    trim: true,
    maxLength: [100, 'El título no puede exceder 100 caracteres']
  },
  comment: {
    type: String,
    required: [true, 'El comentario es obligatorio'],
    trim: true,
    maxLength: [1000, 'El comentario no puede exceder 1000 caracteres']
  },
  pros: [String],
  cons: [String],
  images: [{
    url: String,
    alt: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  adminNotes: String,
  helpfulVotes: {
    type: Number,
    default: 0
  },
  usersWhoVotedHelpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  response: {
    comment: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ isVerifiedPurchase: 1 });

// Índice compuesto para evitar reseñas duplicadas
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Virtual para mostrar fecha formateada
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Middleware para verificar compra antes de guardar
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Order = mongoose.model('Order');
      const verifiedPurchase = await Order.findOne({
        user: this.user,
        'items.product': this.product,
        status: 'delivered'
      });
      
      this.isVerifiedPurchase = !!verifiedPurchase;
      if (verifiedPurchase) {
        this.order = verifiedPurchase._id;
      }
    } catch (error) {
      console.error('Error verificando compra:', error);
    }
  }
  next();
});

// Middleware para actualizar calificación promedio del producto
reviewSchema.post('save', async function() {
  try {
    const Product = mongoose.model('Product');
    const stats = await this.constructor.aggregate([
      { $match: { product: this.product, isApproved: true } },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          numReviews: { $sum: 1 }
        }
      }
    ]);
    
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(this.product, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        numReviews: stats[0].numReviews
      });
    }
  } catch (error) {
    console.error('Error actualizando calificación del producto:', error);
  }
});

// Middleware para actualizar calificación promedio al eliminar
reviewSchema.post('remove', async function() {
  try {
    const Product = mongoose.model('Product');
    const stats = await this.constructor.aggregate([
      { $match: { product: this.product, isApproved: true } },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          numReviews: { $sum: 1 }
        }
      }
    ]);
    
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(this.product, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        numReviews: stats[0].numReviews
      });
    } else {
      await Product.findByIdAndUpdate(this.product, {
        averageRating: 0,
        numReviews: 0
      });
    }
  } catch (error) {
    console.error('Error actualizando calificación del producto:', error);
  }
});

// Método para marcar como útil
reviewSchema.methods.markAsHelpful = function(userId) {
  if (!this.usersWhoVotedHelpful.includes(userId)) {
    this.usersWhoVotedHelpful.push(userId);
    this.helpfulVotes += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Método para desmarcar como útil
reviewSchema.methods.unmarkAsHelpful = function(userId) {
  const index = this.usersWhoVotedHelpful.indexOf(userId);
  if (index > -1) {
    this.usersWhoVotedHelpful.splice(index, 1);
    this.helpfulVotes = Math.max(0, this.helpfulVotes - 1);
    return this.save();
  }
  return Promise.resolve(this);
};

// Método para aprobar reseña
reviewSchema.methods.approve = function() {
  this.isApproved = true;
  return this.save();
};

// Método para rechazar reseña
reviewSchema.methods.reject = function(reason = '') {
  this.isApproved = false;
  this.adminNotes = reason;
  return this.save();
};

// Método para reportar reseña
reviewSchema.methods.report = function(reason) {
  this.isReported = true;
  this.reportReason = reason;
  return this.save();
};

// Método para responder reseña
reviewSchema.methods.addResponse = function(comment, respondedBy) {
  this.response = {
    comment: comment,
    respondedBy: respondedBy,
    respondedAt: new Date()
  };
  return this.save();
};

module.exports = mongoose.model('Review', reviewSchema);