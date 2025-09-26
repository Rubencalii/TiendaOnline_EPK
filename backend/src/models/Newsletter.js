const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  firstName: {
    type: String,
    trim: true,
    maxLength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: [50, 'Los apellidos no pueden exceder 50 caracteres']
  },
  preferences: {
    products: {
      type: Boolean,
      default: true
    },
    offers: {
      type: Boolean,
      default: true
    },
    concerts: {
      type: Boolean,
      default: true
    },
    news: {
      type: Boolean,
      default: true
    }
  },
  categories: [{
    type: String,
    enum: [
      'guitarras',
      'teclados',
      'percusion',
      'viento',
      'cuerdas',
      'sonido',
      'iluminacion',
      'accesorios',
      'amplificadores',
      'microfonos',
      'auriculares'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['website', 'store', 'concert', 'social', 'referral', 'other'],
    default: 'website'
  },
  confirmationToken: String,
  confirmedAt: Date,
  unsubscribeToken: {
    type: String,
    unique: true
  },
  unsubscribedAt: Date,
  lastEmailSent: Date,
  totalEmailsSent: {
    type: Number,
    default: 0
  },
  bounceCount: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ confirmedAt: 1 });
newsletterSchema.index({ categories: 1 });
newsletterSchema.index({ createdAt: -1 });

// Virtual para nombre completo
newsletterSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.email;
});

// Virtual para verificar si está confirmado
newsletterSchema.virtual('isConfirmed').get(function() {
  return !!this.confirmedAt;
});

// Middleware para generar token de desuscripción
newsletterSchema.pre('save', function(next) {
  if (this.isNew && !this.unsubscribeToken) {
    this.unsubscribeToken = require('crypto')
      .randomBytes(32)
      .toString('hex');
  }
  next();
});

// Método para confirmar suscripción
newsletterSchema.methods.confirm = function() {
  this.confirmedAt = new Date();
  this.confirmationToken = undefined;
  return this.save();
};

// Método para desuscribir
newsletterSchema.methods.unsubscribe = function() {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  return this.save();
};

// Método para reactivar suscripción
newsletterSchema.methods.resubscribe = function() {
  this.isActive = true;
  this.unsubscribedAt = undefined;
  return this.save();
};

// Método para registrar envío de email
newsletterSchema.methods.recordEmailSent = function() {
  this.lastEmailSent = new Date();
  this.totalEmailsSent += 1;
  return this.save();
};

// Método para registrar rebote
newsletterSchema.methods.recordBounce = function() {
  this.bounceCount += 1;
  
  // Desactivar automáticamente después de 3 rebotes
  if (this.bounceCount >= 3) {
    this.isActive = false;
  }
  
  return this.save();
};

module.exports = mongoose.model('Newsletter', newsletterSchema);