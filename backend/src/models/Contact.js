const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxLength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true,
    maxLength: [50, 'Los apellidos no pueden exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[0-9\s-]{9,15}$/, 'Por favor ingresa un número de teléfono válido']
  },
  subject: {
    type: String,
    required: [true, 'El asunto es obligatorio'],
    trim: true,
    maxLength: [100, 'El asunto no puede exceder 100 caracteres']
  },
  message: {
    type: String,
    required: [true, 'El mensaje es obligatorio'],
    trim: true,
    maxLength: [2000, 'El mensaje no puede exceder 2000 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'general',
      'products',
      'orders',
      'rentals',
      'concerts',
      'technical-support',
      'warranty',
      'complaints',
      'suggestions',
      'partnerships',
      'press',
      'other'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'replied', 'resolved', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'email', 'phone', 'store', 'social', 'other'],
    default: 'website'
  },
  customerType: {
    type: String,
    enum: ['new', 'existing', 'vip', 'business'],
    default: 'new'
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  relatedRental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental'
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date,
    responseMethod: {
      type: String,
      enum: ['email', 'phone', 'store', 'other']
    }
  },
  followUps: [{
    message: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['note', 'call', 'email', 'meeting']
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  tags: [String],
  isSpam: {
    type: Boolean,
    default: false
  },
  spamScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    surveyToken: String,
    respondedAt: Date
  },
  internalNotes: String,
  resolvedAt: Date,
  resolution: String,
  estimatedResponseTime: Date,
  actualResponseTime: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ category: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isSpam: 1 });

// Virtual para nombre completo
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual para tiempo de respuesta
contactSchema.virtual('responseTimeHours').get(function() {
  if (this.actualResponseTime && this.createdAt) {
    const diffMs = this.actualResponseTime - this.createdAt;
    return Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
  }
  return null;
});

// Virtual para verificar si está atrasado
contactSchema.virtual('isOverdue').get(function() {
  if (this.estimatedResponseTime && !this.actualResponseTime) {
    return new Date() > this.estimatedResponseTime;
  }
  return false;
});

// Middleware para calcular tiempo estimado de respuesta
contactSchema.pre('save', function(next) {
  if (this.isNew && !this.estimatedResponseTime) {
    const now = new Date();
    let hours = 24; // Por defecto 24 horas
    
    // Ajustar según prioridad
    switch (this.priority) {
      case 'urgent':
        hours = 2;
        break;
      case 'high':
        hours = 4;
        break;
      case 'medium':
        hours = 12;
        break;
      case 'low':
        hours = 48;
        break;
    }
    
    this.estimatedResponseTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
  }
  next();
});

// Método para responder
contactSchema.methods.reply = function(message, respondedBy, method = 'email') {
  this.response = {
    message: message,
    respondedBy: respondedBy,
    respondedAt: new Date(),
    responseMethod: method
  };
  this.status = 'replied';
  this.actualResponseTime = new Date();
  return this.save();
};

// Método para agregar seguimiento
contactSchema.methods.addFollowUp = function(message, createdBy, type = 'note') {
  this.followUps.push({
    message: message,
    createdBy: createdBy,
    type: type
  });
  return this.save();
};

// Método para asignar
contactSchema.methods.assignTo = function(userId) {
  this.assignedTo = userId;
  this.status = 'in-progress';
  return this.save();
};

// Método para resolver
contactSchema.methods.resolve = function(resolution) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolution = resolution;
  return this.save();
};

// Método para cerrar
contactSchema.methods.close = function() {
  this.status = 'closed';
  return this.save();
};

// Método para marcar como spam
contactSchema.methods.markAsSpam = function() {
  this.isSpam = true;
  this.spamScore = 100;
  return this.save();
};

// Método para generar token de encuesta
contactSchema.methods.generateSurveyToken = function() {
  this.satisfaction.surveyToken = require('crypto')
    .randomBytes(32)
    .toString('hex');
  return this.save();
};

// Método para registrar satisfacción
contactSchema.methods.recordSatisfaction = function(rating, comment = '') {
  this.satisfaction.rating = rating;
  this.satisfaction.comment = comment;
  this.satisfaction.respondedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);