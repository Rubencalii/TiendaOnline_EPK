const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Usuario no encontrado.'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta con soporte.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor, inicia sesión nuevamente.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error del servidor en autenticación.'
    });
  }
};

// Middleware opcional de autenticación (para rutas públicas que pueden beneficiarse del usuario)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // En auth opcional, no bloqueamos la request si hay error
    next();
  }
};

// Middleware para verificar roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Autenticación requerida.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Permisos insuficientes.'
      });
    }
    
    next();
  };
};

// Middleware para verificar si el usuario es propietario del recurso
const checkOwnership = (resourcePath = 'user') => {
  return (req, res, next) => {
    const resourceUserId = req.params.userId || req.body.userId || req.user.id;
    
    // Los admin pueden acceder a cualquier recurso
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Verificar que el usuario es propietario del recurso
    if (req.user.id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. No puedes acceder a este recurso.'
      });
    }
    
    next();
  };
};

// Middleware para generar token JWT
const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

// Middleware para refrescar token
const refreshToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado.'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    
    // Verificar si el token expira en menos de 24 horas
    const now = Math.floor(Date.now() / 1000);
    const tokenExp = decoded.exp;
    const hoursUntilExpiration = (tokenExp - now) / 3600;
    
    if (hoursUntilExpiration < 24) {
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        const newToken = generateToken(user.id);
        res.setHeader('X-New-Token', newToken);
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  auth,
  optionalAuth,
  authorize,
  checkOwnership,
  generateToken,
  refreshToken
};