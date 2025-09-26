const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxLength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción del producto es obligatoria'],
    maxLength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  originalPrice: {
    type: Number,
    min: [0, 'El precio original no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
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
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'La marca es obligatoria'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePercentage: {
    type: Number,
    min: [0, 'El descuento no puede ser negativo'],
    max: [100, 'El descuento no puede exceder 100%']
  },
  specifications: {
    dimensions: String,
    weight: String,
    color: String,
    material: String,
    origin: String,
    warranty: String,
    includes: [String]
  },
  tags: [String],
  averageRating: {
    type: Number,
    min: [0, 'La calificación no puede ser negativa'],
    max: [5, 'La calificación no puede exceder 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isForRental: {
    type: Boolean,
    default: false
  },
  rentalPrice: {
    daily: Number,
    weekly: Number,
    monthly: Number
  },
  seoTitle: String,
  seoDescription: String,
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar búsquedas
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ isAvailable: 1, stock: 1 });
productSchema.index({ isFeatured: -1 });
productSchema.index({ isOnSale: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

// Virtual para calcular precio con descuento
productSchema.virtual('discountedPrice').get(function() {
  if (this.isOnSale && this.salePercentage) {
    return this.price - (this.price * this.salePercentage / 100);
  }
  return this.price;
});

// Middleware para generar slug antes de guardar
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Método para verificar disponibilidad
productSchema.methods.isInStock = function(quantity = 1) {
  return this.isAvailable && this.stock >= quantity;
};

module.exports = mongoose.model('Product', productSchema);