const express = require('express');
const Rental = require('../models/Rental');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const { validateRental, validateMongoId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/rentals/equipment
// @desc    Obtener equipos disponibles para alquiler
// @access  Public
router.get('/equipment', async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 12 } = req.query;
    
    const filters = {
      isAvailable: true,
      isForRental: true,
      stock: { $gt: 0 }
    };
    
    if (category) filters.category = category;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    let equipment = await Product.find(filters)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum)
      .select('name description images category brand stock rentalPrice specifications tags');
    
    // Si se proporcionan fechas, verificar disponibilidad
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (let item of equipment) {
        // Buscar alquileres activos que conflicten con las fechas
        const conflictingRentals = await Rental.find({
          'equipment.product': item._id,
          status: { $in: ['confirmed', 'active', 'preparing', 'ready'] },
          $or: [
            {
              'rentalPeriod.startDate': { $lte: end },
              'rentalPeriod.endDate': { $gte: start }
            }
          ]
        });
        
        const reservedQuantity = conflictingRentals.reduce((total, rental) => {
          const equipmentItem = rental.equipment.find(eq => 
            eq.product.toString() === item._id.toString()
          );
          return total + (equipmentItem ? equipmentItem.quantity : 0);
        }, 0);
        
        item = item.toObject();
        item.availableStock = item.stock - reservedQuantity;
      }
    }
    
    const total = await Product.countDocuments(filters);
    
    res.json({
      success: true,
      data: {
        equipment,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo equipos:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/rentals/quote
// @desc    Obtener cotización para alquiler
// @access  Public
router.post('/quote', async (req, res) => {
  try {
    const { equipment, startDate, endDate, deliveryRequired, address } = req.body;
    
    if (!equipment || !Array.isArray(equipment) || equipment.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere al menos un equipo'
      });
    }
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Las fechas de inicio y fin son requeridas'
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days < 1) {
      return res.status(400).json({
        success: false,
        message: 'El alquiler debe ser de al menos 1 día'
      });
    }
    
    let subtotal = 0;
    let equipmentItems = [];
    let unavailableItems = [];
    
    for (const item of equipment) {
      const product = await Product.findById(item.productId);
      
      if (!product || !product.isForRental) {
        unavailableItems.push({
          productId: item.productId,
          reason: 'Producto no disponible para alquiler'
        });
        continue;
      }
      
      // Verificar disponibilidad para las fechas
      const conflicts = await Rental.find({
        'equipment.product': product._id,
        status: { $in: ['confirmed', 'active', 'preparing', 'ready'] },
        $or: [
          {
            'rentalPeriod.startDate': { $lte: end },
            'rentalPeriod.endDate': { $gte: start }
          }
        ]
      });
      
      const reservedQuantity = conflicts.reduce((total, rental) => {
        const equipmentItem = rental.equipment.find(eq => 
          eq.product.toString() === product._id.toString()
        );
        return total + (equipmentItem ? equipmentItem.quantity : 0);
      }, 0);
      
      const availableStock = product.stock - reservedQuantity;
      
      if (availableStock < item.quantity) {
        unavailableItems.push({
          productId: item.productId,
          name: product.name,
          requested: item.quantity,
          available: availableStock,
          reason: 'Stock insuficiente para las fechas solicitadas'
        });
        continue;
      }
      
      const dailyRate = product.rentalPrice?.daily || 0;
      const itemSubtotal = dailyRate * item.quantity * days;
      subtotal += itemSubtotal;
      
      equipmentItems.push({
        product: product._id,
        name: product.name,
        dailyRate,
        quantity: item.quantity,
        totalDays: days,
        subtotal: itemSubtotal,
        image: product.images?.[0]?.url
      });
    }
    
    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Algunos productos no están disponibles',
        unavailableItems
      });
    }
    
    // Calcular costos adicionales
    let deliveryFee = 0;
    if (deliveryRequired && address) {
      // Cálculo básico de delivery (se puede hacer más sofisticado)
      deliveryFee = subtotal > 200 ? 0 : 25; // Delivery gratuito para alquileres > 200€
    }
    
    const setupFee = equipmentItems.length > 5 ? 50 : 0; // Setup fee para muchos equipos
    const deposit = subtotal * 0.3; // 30% de depósito
    const totalAmount = subtotal + deliveryFee + setupFee;
    
    res.json({
      success: true,
      data: {
        quote: {
          equipment: equipmentItems,
          pricing: {
            subtotal,
            deliveryFee,
            setupFee,
            totalAmount,
            deposit
          },
          rentalPeriod: {
            startDate: start,
            endDate: end,
            totalDays: days
          },
          validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000) // Válida por 48 horas
        }
      }
    });
    
  } catch (error) {
    console.error('Error generando cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/rentals
// @desc    Crear nuevo alquiler
// @access  Private
router.post('/', auth, validateRental, async (req, res) => {
  try {
    const rentalData = { ...req.body };
    rentalData.user = req.user.id;
    
    const rental = new Rental(rentalData);
    
    // Verificar disponibilidad antes de guardar
    const conflicts = await rental.checkEquipmentAvailability();
    if (conflicts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Algunos equipos no están disponibles',
        conflicts
      });
    }
    
    await rental.save();
    
    res.status(201).json({
      success: true,
      message: 'Solicitud de alquiler creada correctamente',
      data: {
        rental: {
          id: rental._id,
          rentalNumber: rental.rentalNumber,
          status: rental.status,
          totalAmount: rental.pricing.totalAmount
        }
      }
    });
    
  } catch (error) {
    console.error('Error creando alquiler:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al crear el alquiler'
    });
  }
});

// @route   GET /api/rentals
// @desc    Obtener alquileres del usuario
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filters = { user: req.user.id };
    if (status) filters.status = status;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const rentals = await Rental.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('equipment.product', 'name images')
      .select('rentalNumber status rentalPeriod pricing.totalAmount createdAt');
    
    const total = await Rental.countDocuments(filters);
    
    res.json({
      success: true,
      data: {
        rentals,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo alquileres:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/rentals/:id
// @desc    Obtener alquiler específico
// @access  Private
router.get('/:id', auth, validateMongoId('id'), async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('equipment.product', 'name images specifications')
      .populate('statusHistory.updatedBy', 'firstName lastName');
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Alquiler no encontrado'
      });
    }
    
    // Verificar que el usuario sea el propietario o admin
    if (req.user.role !== 'admin' && rental.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este alquiler'
      });
    }
    
    res.json({
      success: true,
      data: {
        rental
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo alquiler:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   PUT /api/rentals/:id/extend
// @desc    Extender alquiler
// @access  Private
router.put('/:id/extend', auth, validateMongoId('id'), async (req, res) => {
  try {
    const { newEndDate } = req.body;
    
    if (!newEndDate) {
      return res.status(400).json({
        success: false,
        message: 'La nueva fecha de fin es requerida'
      });
    }
    
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Alquiler no encontrado'
      });
    }
    
    // Verificar que el usuario sea el propietario
    if (rental.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para modificar este alquiler'
      });
    }
    
    if (!['active', 'confirmed'].includes(rental.status)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede extender un alquiler en este estado'
      });
    }
    
    const newEnd = new Date(newEndDate);
    const currentEnd = rental.rentalPeriod.endDate;
    
    if (newEnd <= currentEnd) {
      return res.status(400).json({
        success: false,
        message: 'La nueva fecha debe ser posterior a la fecha actual de fin'
      });
    }
    
    // Calcular costo adicional
    const additionalDays = Math.ceil((newEnd - currentEnd) / (1000 * 60 * 60 * 24));
    let additionalCost = 0;
    
    for (const equipment of rental.equipment) {
      additionalCost += equipment.dailyRate * equipment.quantity * additionalDays;
    }
    
    await rental.extend(newEnd, additionalCost);
    
    res.json({
      success: true,
      message: 'Alquiler extendido correctamente',
      data: {
        newEndDate: newEnd,
        additionalCost,
        newTotal: rental.pricing.totalAmount
      }
    });
    
  } catch (error) {
    console.error('Error extendiendo alquiler:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// RUTAS ADMIN

// @route   GET /api/rentals/admin/all
// @desc    Obtener todos los alquileres (Admin)
// @access  Private (Admin)
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      status,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20
    } = req.query;
    
    const filters = {};
    
    if (status) filters.status = status;
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filters.$or = [
        { rentalNumber: new RegExp(search, 'i') },
        { 'customerInfo.firstName': new RegExp(search, 'i') },
        { 'customerInfo.lastName': new RegExp(search, 'i') },
        { 'eventInfo.eventName': new RegExp(search, 'i') }
      ];
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const rentals = await Rental.find(filters)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('rentalNumber user status rentalPeriod pricing.totalAmount customerInfo.firstName customerInfo.lastName createdAt');
    
    const total = await Rental.countDocuments(filters);
    
    res.json({
      success: true,
      data: {
        rentals,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo alquileres (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   PUT /api/rentals/:id/status
// @desc    Actualizar estado del alquiler (Admin)
// @access  Private (Admin)
router.put('/:id/status', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const { status, note } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'El estado es requerido'
      });
    }
    
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Alquiler no encontrado'
      });
    }
    
    await rental.updateStatus(status, note, req.user.id);
    
    res.json({
      success: true,
      message: 'Estado del alquiler actualizado correctamente'
    });
    
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;