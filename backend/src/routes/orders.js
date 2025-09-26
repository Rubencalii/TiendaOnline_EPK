const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, authorize, checkOwnership } = require('../middleware/auth');
const { validateOrder, validateMongoId } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/orders
// @desc    Crear nuevo pedido
// @access  Private
router.post('/', auth, validateOrder, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentInfo,
      customerNotes,
      couponCode,
      isGift,
      giftMessage,
      requiresPickup,
      pickupDate,
      pickupLocation
    } = req.body;
    
    // Verificar disponibilidad y precios de los productos
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Producto ${item.product} no encontrado`
        });
      }
      
      if (!product.isInStock(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
        });
      }
      
      const itemPrice = product.isOnSale && product.salePercentage 
        ? product.price - (product.price * product.salePercentage / 100)
        : product.price;
      
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 
          ? product.images.find(img => img.isPrimary)?.url || product.images[0].url
          : null,
        total: itemTotal
      });
    }
    
    // Calcular costos adicionales
    const taxRate = 0.21; // IVA 21% en España
    const taxAmount = subtotal * taxRate;
    
    let shippingCost = 0;
    if (!requiresPickup) {
      // Envío gratuito para pedidos > 50€
      shippingCost = subtotal >= 50 ? 0 : 5.95;
    }
    
    let discountAmount = 0;
    // TODO: Implementar lógica de cupones
    
    const totalAmount = subtotal + taxAmount + shippingCost - discountAmount;
    
    // Crear el pedido
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentInfo: {
        method: paymentInfo.method,
        status: 'pending'
      },
      subtotal,
      taxAmount,
      shippingCost,
      discountAmount,
      totalAmount,
      customerNotes,
      couponCode,
      isGift,
      giftMessage,
      requiresPickup,
      pickupDate,
      pickupLocation
    });
    
    await order.save();
    
    // Actualizar stock de productos
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Limpiar carrito del usuario
    await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });
    
    res.status(201).json({
      success: true,
      message: 'Pedido creado correctamente',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al crear el pedido'
    });
  }
});

// @route   GET /api/orders
// @desc    Obtener pedidos del usuario
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filters = { user: req.user.id };
    if (status) filters.status = status;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const orders = await Order.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('items.product', 'name images slug')
      .select('orderNumber status items totalAmount paymentInfo createdAt estimatedDelivery trackingNumber');
    
    const total = await Order.countDocuments(filters);
    
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Obtener pedido específico
// @access  Private
router.get('/:id', auth, validateMongoId('id'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images slug category brand')
      .populate('statusHistory.updatedBy', 'firstName lastName');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }
    
    // Verificar que el usuario sea el propietario o admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este pedido'
      });
    }
    
    res.json({
      success: true,
      data: {
        order
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancelar pedido
// @access  Private
router.put('/:id/cancel', auth, validateMongoId('id'), async (req, res) => {
  try {
    const { cancelReason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }
    
    // Verificar que el usuario sea el propietario
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para cancelar este pedido'
      });
    }
    
    // Verificar si se puede cancelar
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar este pedido en su estado actual'
      });
    }
    
    // Actualizar estado y devolver stock
    await order.updateStatus('cancelled', cancelReason);
    order.cancelReason = cancelReason;
    await order.save();
    
    // Devolver stock a los productos
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }
    
    res.json({
      success: true,
      message: 'Pedido cancelado correctamente'
    });
    
  } catch (error) {
    console.error('Error cancelando pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al cancelar el pedido'
    });
  }
});

// RUTAS ADMIN

// @route   GET /api/orders/admin/all
// @desc    Obtener todos los pedidos (Admin)
// @access  Private (Admin)
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20
    } = req.query;
    
    const filters = {};
    
    if (status) filters.status = status;
    if (paymentStatus) filters['paymentInfo.status'] = paymentStatus;
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filters.$or = [
        { orderNumber: new RegExp(search, 'i') },
        { 'shippingAddress.firstName': new RegExp(search, 'i') },
        { 'shippingAddress.lastName': new RegExp(search, 'i') },
        { trackingNumber: new RegExp(search, 'i') }
      ];
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const orders = await Order.find(filters)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('orderNumber user status paymentInfo totalAmount createdAt trackingNumber estimatedDelivery');
    
    const total = await Order.countDocuments(filters);
    
    // Obtener estadísticas
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        stats
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo pedidos (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Actualizar estado del pedido (Admin)
// @access  Private (Admin)
router.put('/:id/status', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const { status, note, trackingNumber, estimatedDelivery } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'El estado es requerido'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }
    
    await order.updateStatus(status, note, req.user.id);
    
    // Actualizar campos adicionales
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Estado del pedido actualizado correctamente'
    });
    
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al actualizar el estado'
    });
  }
});

// @route   GET /api/orders/stats/dashboard
// @desc    Obtener estadísticas para dashboard (Admin)
// @access  Private (Admin)
router.get('/stats/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    
    // Estadísticas generales
    const totalOrders = await Order.countDocuments();
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    // Revenue
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth },
          status: { $ne: 'cancelled' }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    // Pedidos por estado
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Ventas por día (últimos 7 días)
    const salesByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfYear: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.day': 1 }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          monthlyOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0
        },
        ordersByStatus,
        salesByDay
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;