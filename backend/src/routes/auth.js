const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { auth, generateToken } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { uploadUserAvatar } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }
    
    // Crear nuevo usuario
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth
    });
    
    await user.save();
    
    // Generar token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: '¡Registro exitoso! Bienvenido a Epk Música',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor durante el registro'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario por email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar si la cuenta está activa
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cuenta desactivada. Contacta con soporte.'
      });
    }
    
    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();
    
    // Generar token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: `¡Bienvenido de vuelta, ${user.firstName}!`,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          cartItemsCount: user.cartItemsCount,
          lastLogin: user.lastLogin
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor durante el inicio de sesión'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener información del usuario autenticado
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'name price images category brand')
      .populate('cart.product', 'name price images category brand stock isAvailable');
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          avatar: user.avatar,
          address: user.address,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          preferences: user.preferences,
          wishlist: user.wishlist,
          cart: user.cart,
          cartItemsCount: user.cartItemsCount,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Actualizar perfil de usuario
// @access  Private
router.put('/profile', auth, uploadUserAvatar, async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, address, preferences } = req.body;
    
    const updateData = {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      preferences
    };
    
    // Si se subió un avatar, agregarlo al update
    if (req.file) {
      updateData.avatar = req.file.path.replace(/\\/g, '/');
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          avatar: user.avatar,
          address: user.address,
          preferences: user.preferences
        }
      }
    });
    
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al actualizar el perfil'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Cambiar contraseña
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validar que se proporcionaron ambas contraseñas
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren la contraseña actual y la nueva'
      });
    }
    
    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }
    
    // Obtener usuario con contraseña
    const user = await User.findById(req.user.id).select('+password');
    
    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }
    
    // Actualizar contraseña
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Contraseña cambiada correctamente'
    });
    
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al cambiar la contraseña'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Solicitar restablecimiento de contraseña
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return res.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace de restablecimiento'
      });
    }
    
    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hora
    await user.save();
    
    // Aquí se enviaría el email con el token
    // TODO: Implementar envío de email
    
    res.json({
      success: true,
      message: 'Si el email existe, recibirás un enlace de restablecimiento',
      // Solo para desarrollo, remover en producción
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
    
  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Restablecer contraseña con token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }
    
    // Buscar usuario con token válido
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    // Actualizar contraseña
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Contraseña restablecida correctamente'
    });
    
  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Cerrar sesión (opcional para JWT)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada correctamente'
  });
});

module.exports = router;