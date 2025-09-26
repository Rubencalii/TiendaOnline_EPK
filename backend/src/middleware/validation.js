const { body, param, query, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().forEach(error => {
      if (!extractedErrors[error.path]) {
        extractedErrors[error.path] = [];
      }
      extractedErrors[error.path].push(error.msg);
    });
    
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: extractedErrors
    });
  }
  
  next();
};

// Validaciones para autenticación
const validateRegister = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Los apellidos deben tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Los apellidos solo pueden contener letras y espacios'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s-]{9,15}$/)
    .withMessage('El teléfono no tiene un formato válido'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
  
  handleValidationErrors
];

// Validaciones para productos
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
  
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser un número mayor a 0'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El precio original debe ser un número mayor a 0'),
  
  body('category')
    .isIn(['guitarras', 'teclados', 'percusion', 'viento', 'cuerdas', 'sonido', 'iluminacion', 'accesorios', 'amplificadores', 'microfonos', 'auriculares'])
    .withMessage('La categoría no es válida'),
  
  body('brand')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('La marca es obligatoria y no puede exceder 50 caracteres'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  
  handleValidationErrors
];

// Validaciones para pedidos
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('El pedido debe tener al menos un producto'),
  
  body('items.*.product')
    .isMongoId()
    .withMessage('ID de producto inválido'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
  
  body('shippingAddress.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('shippingAddress.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),
  
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('La dirección debe tener entre 5 y 100 caracteres'),
  
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La ciudad debe tener entre 2 y 50 caracteres'),
  
  body('shippingAddress.postalCode')
    .matches(/^\d{5}$/)
    .withMessage('El código postal debe tener 5 dígitos'),
  
  body('paymentInfo.method')
    .isIn(['card', 'paypal', 'bizum', 'transfer', 'cash'])
    .withMessage('Método de pago inválido'),
  
  handleValidationErrors
];

// Validaciones para reseñas
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5'),
  
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El título debe tener entre 5 y 100 caracteres'),
  
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('El comentario debe tener entre 10 y 1000 caracteres'),
  
  body('pros')
    .optional()
    .isArray()
    .withMessage('Los pros deben ser un array'),
  
  body('cons')
    .optional()
    .isArray()
    .withMessage('Los contras deben ser un array'),
  
  handleValidationErrors
];

// Validaciones para alquiler
const validateRental = [
  body('equipment')
    .isArray({ min: 1 })
    .withMessage('El alquiler debe tener al menos un equipo'),
  
  body('equipment.*.product')
    .isMongoId()
    .withMessage('ID de producto inválido'),
  
  body('equipment.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
  
  body('rentalPeriod.startDate')
    .isISO8601()
    .withMessage('La fecha de inicio debe ser válida')
    .custom(value => {
      if (new Date(value) < new Date()) {
        throw new Error('La fecha de inicio no puede ser en el pasado');
      }
      return true;
    }),
  
  body('rentalPeriod.endDate')
    .isISO8601()
    .withMessage('La fecha de fin debe ser válida')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.rentalPeriod.startDate)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  
  body('customerInfo.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('customerInfo.email')
    .trim()
    .isEmail()
    .withMessage('El email no es válido'),
  
  body('customerInfo.phone')
    .matches(/^\+?[0-9\s-]{9,15}$/)
    .withMessage('El teléfono no tiene un formato válido'),
  
  handleValidationErrors
];

// Validaciones para contacto
const validateContact = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),
  
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El asunto debe tener entre 5 y 100 caracteres'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('El mensaje debe tener entre 10 y 2000 caracteres'),
  
  body('category')
    .isIn(['general', 'products', 'orders', 'rentals', 'concerts', 'technical-support', 'warranty', 'complaints', 'suggestions', 'partnerships', 'press', 'other'])
    .withMessage('La categoría no es válida'),
  
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s-]{9,15}$/)
    .withMessage('El teléfono no tiene un formato válido'),
  
  handleValidationErrors
];

// Validaciones para newsletter
const validateNewsletter = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El nombre no puede exceder 50 caracteres'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('Las categorías deben ser un array'),
  
  handleValidationErrors
];

// Validaciones para parámetros de ID
const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage('ID inválido'),
  
  handleValidationErrors
];

// Validaciones para consultas de búsqueda
const validateSearchQuery = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('La consulta debe tener entre 1 y 100 caracteres'),
  
  query('category')
    .optional()
    .isIn(['guitarras', 'teclados', 'percusion', 'viento', 'cuerdas', 'sonido', 'iluminacion', 'accesorios', 'amplificadores', 'microfonos', 'auriculares'])
    .withMessage('Categoría inválida'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio mínimo debe ser un número mayor o igual a 0'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio máximo debe ser un número mayor o igual a 0'),
  
  query('sort')
    .optional()
    .isIn(['price-asc', 'price-desc', 'name-asc', 'name-desc', 'date-asc', 'date-desc', 'rating-desc'])
    .withMessage('Orden de clasificación inválido'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El número de página debe ser un entero mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('El límite debe ser un entero entre 1 y 50'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateReview,
  validateRental,
  validateContact,
  validateNewsletter,
  validateMongoId,
  validateSearchQuery
};