const express = require('express');
const Product = require('../models/Product');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { validateProduct, validateMongoId, validateSearchQuery } = require('../middleware/validation');
const { uploadProductImages, getFileUrl } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/products
// @desc    Obtener todos los productos con filtros y búsqueda
// @access  Public
router.get('/', validateSearchQuery, optionalAuth, async (req, res) => {
  try {
    const {
      q,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      isOnSale,
      isFeatured,
      isForRental,
      sort = 'createdAt',
      page = 1,
      limit = 12,
      tags
    } = req.query;
    
    // Construir filtros
    const filters = { isAvailable: true };
    
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (brand) filters.brand = new RegExp(brand, 'i');
    if (isOnSale === 'true') filters.isOnSale = true;
    if (isFeatured === 'true') filters.isFeatured = true;
    if (isForRental === 'true') filters.isForRental = true;
    if (tags) filters.tags = { $in: tags.split(',') };
    
    // Filtros de precio
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }
    
    // Búsqueda por texto
    if (q) {
      filters.$text = { $search: q };
    }
    
    // Configurar ordenamiento
    let sortOptions = {};
    switch (sort) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'name-asc':
        sortOptions = { name: 1 };
        break;
      case 'name-desc':
        sortOptions = { name: -1 };
        break;
      case 'rating-desc':
        sortOptions = { averageRating: -1 };
        break;
      case 'date-desc':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
    
    // Si hay búsqueda por texto, agregar score al ordenamiento
    if (q) {
      sortOptions = { score: { $meta: 'textScore' }, ...sortOptions };
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Obtener productos
    const products = await Product.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select('name description price originalPrice category subcategory brand images stock isOnSale salePercentage averageRating numReviews tags slug isFeatured isForRental rentalPrice');
    
    // Contar total de productos
    const total = await Product.countDocuments(filters);
    
    // Agregar URLs completas a las imágenes
    const productsWithImageUrls = products.map(product => {
      const productObj = product.toObject();
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(image => ({
          ...image,
          url: getFileUrl(image.url, req)
        }));
      }
      return productObj;
    });
    
    res.json({
      success: true,
      data: {
        products: productsWithImageUrls,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        filters: {
          q,
          category,
          subcategory,
          brand,
          minPrice,
          maxPrice,
          isOnSale,
          isFeatured,
          isForRental,
          sort
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener productos'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Obtener productos destacados
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ 
      isAvailable: true, 
      isFeatured: true 
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('name price originalPrice images category brand isOnSale salePercentage averageRating numReviews slug');
    
    const productsWithImageUrls = products.map(product => {
      const productObj = product.toObject();
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(image => ({
          ...image,
          url: getFileUrl(image.url, req)
        }));
      }
      return productObj;
    });
    
    res.json({
      success: true,
      data: {
        products: productsWithImageUrls
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/products/on-sale
// @desc    Obtener productos en oferta
// @access  Public
router.get('/on-sale', async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    
    const products = await Product.find({ 
      isAvailable: true, 
      isOnSale: true 
    })
      .sort({ salePercentage: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('name price originalPrice images category brand salePercentage averageRating numReviews slug');
    
    const productsWithImageUrls = products.map(product => {
      const productObj = product.toObject();
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(image => ({
          ...image,
          url: getFileUrl(image.url, req)
        }));
      }
      return productObj;
    });
    
    res.json({
      success: true,
      data: {
        products: productsWithImageUrls
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo ofertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Obtener todas las categorías con conteo
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $match: { isAvailable: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          subcategories: { $addToSet: '$subcategory' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        categories
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/products/brands
// @desc    Obtener todas las marcas
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { isAvailable: true });
    
    res.json({
      success: true,
      data: {
        brands: brands.sort()
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo marcas:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/products/search-suggestions
// @desc    Obtener sugerencias de búsqueda
// @access  Public
router.get('/search-suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }
    
    const suggestions = await Product.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { brand: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') }
      ],
      isAvailable: true
    })
      .select('name brand category')
      .limit(5);
    
    const formattedSuggestions = suggestions.map(product => ({
      text: product.name,
      category: product.category,
      brand: product.brand
    }));
    
    res.json({
      success: true,
      data: {
        suggestions: formattedSuggestions
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo sugerencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Obtener producto por ID
// @access  Public
router.get('/:id', validateMongoId('id'), optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Incrementar contador de vistas
    product.views += 1;
    await product.save();
    
    // Obtener productos relacionados (misma categoría)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isAvailable: true
    })
      .limit(4)
      .select('name price images averageRating numReviews slug');
    
    // Agregar URLs completas a las imágenes
    const productWithImageUrls = product.toObject();
    if (productWithImageUrls.images && productWithImageUrls.images.length > 0) {
      productWithImageUrls.images = productWithImageUrls.images.map(image => ({
        ...image,
        url: getFileUrl(image.url, req)
      }));
    }
    
    const relatedWithImageUrls = relatedProducts.map(relatedProduct => {
      const relatedObj = relatedProduct.toObject();
      if (relatedObj.images && relatedObj.images.length > 0) {
        relatedObj.images = relatedObj.images.map(image => ({
          ...image,
          url: getFileUrl(image.url, req)
        }));
      }
      return relatedObj;
    });
    
    res.json({
      success: true,
      data: {
        product: productWithImageUrls,
        relatedProducts: relatedWithImageUrls
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/products
// @desc    Crear nuevo producto
// @access  Private (Admin)
router.post('/', auth, authorize('admin'), uploadProductImages, validateProduct, async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file, index) => ({
        url: file.path.replace(/\\/g, '/'),
        alt: `${req.body.name} - Imagen ${index + 1}`,
        isPrimary: index === 0
      }));
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: {
        product
      }
    });
    
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al crear producto'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private (Admin)
router.put('/:id', auth, authorize('admin'), validateMongoId('id'), uploadProductImages, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    const updateData = { ...req.body };
    
    // Si se subieron nuevas imágenes, reemplazar las existentes
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file, index) => ({
        url: file.path.replace(/\\/g, '/'),
        alt: `${req.body.name || product.name} - Imagen ${index + 1}`,
        isPrimary: index === 0
      }));
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: {
        product: updatedProduct
      }
    });
    
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al actualizar producto'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Eliminar producto (soft delete)
// @access  Private (Admin)
router.delete('/:id', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Soft delete - marcar como no disponible
    product.isAvailable = false;
    await product.save();
    
    res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
    
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al eliminar producto'
    });
  }
});

// @route   POST /api/products/:id/toggle-featured
// @desc    Alternar estado destacado del producto
// @access  Private (Admin)
router.post('/:id/toggle-featured', auth, authorize('admin'), validateMongoId('id'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    product.isFeatured = !product.isFeatured;
    await product.save();
    
    res.json({
      success: true,
      message: `Producto ${product.isFeatured ? 'marcado como destacado' : 'removido de destacados'}`,
      data: {
        isFeatured: product.isFeatured
      }
    });
    
  } catch (error) {
    console.error('Error alternando estado destacado:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;