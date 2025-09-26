const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minLength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[0-9\s-]{9,15}$/, 'Por favor ingresa un número de teléfono válido']
  },
  dateOfBirth: {
    type: Date
  },
  avatar: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    number: String,
    floor: String,
    city: String,
    province: String,
    postalCode: String,
    country: {
      type: String,
      default: 'España'
    }
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'employee'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  preferences: {
    newsletter: {
      type: Boolean,
      default: false
    },
    promotions: {
      type: Boolean,
      default: false
    },
    favoriteCategories: [String],
    language: {
      type: String,
      default: 'es'
    }
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastLogin: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual para nombre completo
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual para items en el carrito
userSchema.virtual('cartItemsCount').get(function() {
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

// Middleware para hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Método para agregar producto al carrito
userSchema.methods.addToCart = function(productId, quantity = 1) {
  const existingItem = this.cart.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cart.push({
      product: productId,
      quantity: quantity
    });
  }
  
  return this.save();
};

// Método para remover producto del carrito
userSchema.methods.removeFromCart = function(productId) {
  this.cart = this.cart.filter(item => 
    item.product.toString() !== productId.toString()
  );
  
  return this.save();
};

// Método para limpiar carrito
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Método para agregar a lista de deseos
userSchema.methods.addToWishlist = function(productId) {
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
  }
  return this.save();
};

// Método para remover de lista de deseos
userSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(id => 
    id.toString() !== productId.toString()
  );
  return this.save();
};

module.exports = mongoose.model('User', userSchema);