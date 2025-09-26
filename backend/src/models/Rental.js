const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  rentalNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  equipment: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    dailyRate: {
      type: Number,
      required: true,
      min: [0, 'La tarifa diaria no puede ser negativa']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    totalDays: {
      type: Number,
      required: true,
      min: [1, 'Debe ser al menos 1 día']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo']
    },
    serialNumbers: [String],
    condition: {
      pickup: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        default: 'excellent'
      },
      return: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      notes: String
    }
  }],
  rentalPeriod: {
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria']
    },
    endDate: {
      type: Date,
      required: [true, 'La fecha de fin es obligatoria']
    },
    actualStartDate: Date,
    actualEndDate: Date
  },
  eventInfo: {
    eventType: {
      type: String,
      enum: ['concert', 'wedding', 'party', 'corporate', 'festival', 'theater', 'studio', 'other']
    },
    eventName: String,
    venue: String,
    venueAddress: String,
    contactPerson: String,
    contactPhone: String,
    specialRequirements: String
  },
  customerInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    idNumber: String,
    address: {
      street: String,
      city: String,
      postalCode: String,
      province: String
    }
  },
  deposit: {
    amount: {
      type: Number,
      required: true,
      min: [0, 'El depósito no puede ser negativo']
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'hold'],
      default: 'hold'
    },
    status: {
      type: String,
      enum: ['pending', 'collected', 'refunded', 'forfeit'],
      default: 'pending'
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundReason: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo']
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'El descuento no puede ser negativo']
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, 'La tarifa de entrega no puede ser negativa']
    },
    setupFee: {
      type: Number,
      default: 0,
      min: [0, 'La tarifa de instalación no puede ser negativa']
    },
    lateFee: {
      type: Number,
      default: 0,
      min: [0, 'La tarifa por retraso no puede ser negativa']
    },
    damageFee: {
      type: Number,
      default: 0,
      min: [0, 'La tarifa por daños no puede ser negativa']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo']
    }
  },
  delivery: {
    required: {
      type: Boolean,
      default: false
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      province: String,
      specialInstructions: String
    },
    scheduledDate: Date,
    scheduledTime: String,
    deliveredAt: Date,
    deliveredBy: String,
    pickedUpAt: Date,
    pickedUpBy: String
  },
  status: {
    type: String,
    enum: [
      'pending',      // Pendiente de confirmación
      'confirmed',    // Confirmado
      'preparing',    // Preparando equipo
      'ready',        // Listo para recoger/entregar
      'active',       // En curso (equipo entregado)
      'overdue',      // Atrasado
      'returning',    // En proceso de devolución
      'completed',    // Completado
      'cancelled'     // Cancelado
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'bizum']
  },
  notes: {
    customer: String,
    internal: String,
    pickup: String,
    return: String
  },
  contract: {
    signed: {
      type: Boolean,
      default: false
    },
    signedAt: Date,
    signedBy: String,
    documentUrl: String
  },
  insurance: {
    required: {
      type: Boolean,
      default: false
    },
    provider: String,
    policyNumber: String,
    coverage: Number
  },
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
rentalSchema.index({ rentalNumber: 1 });
rentalSchema.index({ user: 1, createdAt: -1 });
rentalSchema.index({ status: 1 });
rentalSchema.index({ 'rentalPeriod.startDate': 1 });
rentalSchema.index({ 'rentalPeriod.endDate': 1 });
rentalSchema.index({ createdAt: -1 });

// Virtual para duración total
rentalSchema.virtual('totalDays').get(function() {
  if (this.rentalPeriod.startDate && this.rentalPeriod.endDate) {
    const diffTime = Math.abs(this.rentalPeriod.endDate - this.rentalPeriod.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual para verificar si está atrasado
rentalSchema.virtual('isOverdue').get(function() {
  return this.rentalPeriod.endDate < new Date() && 
         !['completed', 'cancelled'].includes(this.status);
});

// Middleware para generar número de alquiler
rentalSchema.pre('save', async function(next) {
  if (this.isNew && !this.rentalNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const lastRental = await this.constructor.findOne({
      rentalNumber: new RegExp(`^ALQ${year}${month}${day}`)
    }).sort({ rentalNumber: -1 });
    
    let sequence = 1;
    if (lastRental) {
      const lastSequence = parseInt(lastRental.rentalNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.rentalNumber = `ALQ${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
  }
  
  next();
});

// Método para actualizar estado
rentalSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note: note,
    updatedBy: updatedBy
  });
  
  // Actualizar fechas según el estado
  if (newStatus === 'active' && !this.rentalPeriod.actualStartDate) {
    this.rentalPeriod.actualStartDate = new Date();
  } else if (newStatus === 'completed' && !this.rentalPeriod.actualEndDate) {
    this.rentalPeriod.actualEndDate = new Date();
  }
  
  return this.save();
};

// Método para calcular totales
rentalSchema.methods.calculateTotals = function() {
  this.pricing.subtotal = this.equipment.reduce((total, item) => total + item.subtotal, 0);
  this.pricing.totalAmount = this.pricing.subtotal + 
                           this.pricing.deliveryFee + 
                           this.pricing.setupFee + 
                           this.pricing.lateFee + 
                           this.pricing.damageFee - 
                           this.pricing.discountAmount;
  return this;
};

// Método para verificar disponibilidad de equipo
rentalSchema.methods.checkEquipmentAvailability = async function() {
  const Product = mongoose.model('Product');
  const conflicts = [];
  
  for (const item of this.equipment) {
    const product = await Product.findById(item.product);
    if (!product || !product.isForRental) {
      conflicts.push({
        product: item.product,
        reason: 'Producto no disponible para alquiler'
      });
      continue;
    }
    
    // Verificar conflictos con otros alquileres
    const conflictingRentals = await this.constructor.find({
      _id: { $ne: this._id },
      'equipment.product': item.product,
      status: { $in: ['confirmed', 'active', 'preparing', 'ready'] },
      $or: [
        {
          'rentalPeriod.startDate': { 
            $lte: this.rentalPeriod.endDate 
          },
          'rentalPeriod.endDate': { 
            $gte: this.rentalPeriod.startDate 
          }
        }
      ]
    });
    
    const totalRequested = conflictingRentals.reduce((total, rental) => {
      const conflictItem = rental.equipment.find(eq => 
        eq.product.toString() === item.product.toString()
      );
      return total + (conflictItem ? conflictItem.quantity : 0);
    }, 0) + item.quantity;
    
    if (totalRequested > product.stock) {
      conflicts.push({
        product: item.product,
        requested: item.quantity,
        available: product.stock - (totalRequested - item.quantity),
        reason: 'Stock insuficiente para las fechas solicitadas'
      });
    }
  }
  
  return conflicts;
};

// Método para extender alquiler
rentalSchema.methods.extend = function(newEndDate, additionalCost = 0) {
  this.rentalPeriod.endDate = newEndDate;
  this.pricing.totalAmount += additionalCost;
  
  this.statusHistory.push({
    status: this.status,
    note: `Alquiler extendido hasta ${newEndDate.toLocaleDateString()}`,
    date: new Date()
  });
  
  return this.save();
};

module.exports = mongoose.model('Rental', rentalSchema);