const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    image: String,
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo']
    }
  }],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    number: String,
    floor: String,
    city: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'España'
    },
    phone: String,
    additionalInfo: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    number: String,
    floor: String,
    city: String,
    province: String,
    postalCode: String,
    country: {
      type: String,
      default: 'España'
    },
    phone: String,
    companyName: String,
    taxId: String
  },
  paymentInfo: {
    method: {
      type: String,
      required: true,
      enum: ['card', 'paypal', 'bizum', 'transfer', 'cash']
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentDate: Date,
    paymentAmount: Number
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'El subtotal no puede ser negativo']
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Los impuestos no pueden ser negativos']
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: [0, 'El costo de envío no puede ser negativo']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'El descuento no puede ser negativo']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  orderNotes: String,
  customerNotes: String,
  trackingNumber: String,
  shippingCarrier: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  couponCode: String,
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  requiresPickup: {
    type: Boolean,
    default: false
  },
  pickupDate: Date,
  pickupLocation: String,
  cancelledAt: Date,
  cancelReason: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ trackingNumber: 1 });

// Virtual para obtener el número total de items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Middleware para generar número de pedido automáticamente
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Buscar el último pedido del día
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^EPK${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `EPK${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
  }
  
  next();
});

// Método para actualizar estado del pedido
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note: note,
    updatedBy: updatedBy
  });
  
  // Actualizar fechas específicas según el estado
  if (newStatus === 'delivered') {
    this.actualDelivery = new Date();
  } else if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  return this.save();
};

// Método para calcular totales
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((total, item) => total + item.total, 0);
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
  return this;
};

// Método para verificar si se puede cancelar
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Método para verificar si se puede modificar
orderSchema.methods.canBeModified = function() {
  return ['pending'].includes(this.status);
};

module.exports = mongoose.model('Order', orderSchema);