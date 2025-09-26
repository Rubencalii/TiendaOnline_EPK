const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Crear diferentes carpetas según el tipo de archivo
    if (file.fieldname === 'productImages') {
      uploadPath += 'products/';
    } else if (file.fieldname === 'avatar') {
      uploadPath += 'users/';
    } else if (file.fieldname === 'reviewImages') {
      uploadPath += 'reviews/';
    } else if (file.fieldname === 'contactAttachments') {
      uploadPath += 'contact/';
    } else {
      uploadPath += 'misc/';
    }
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/\s+/g, '-').toLowerCase();
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Tipos de archivo permitidos
  const allowedTypes = {
    productImages: /jpeg|jpg|png|webp/,
    avatar: /jpeg|jpg|png|webp/,
    reviewImages: /jpeg|jpg|png|webp/,
    contactAttachments: /jpeg|jpg|png|pdf|doc|docx|txt/
  };
  
  const fieldAllowedTypes = allowedTypes[file.fieldname] || /jpeg|jpg|png/;
  const extname = fieldAllowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fieldAllowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido para ${file.fieldname}`));
  }
};

// Configuración principal de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB por defecto
    files: 10 // Máximo 10 archivos por request
  },
  fileFilter: fileFilter
});

// Middlewares específicos para diferentes tipos de upload
const uploadProductImages = upload.array('productImages', 5);
const uploadUserAvatar = upload.single('avatar');
const uploadReviewImages = upload.array('reviewImages', 3);
const uploadContactAttachments = upload.array('contactAttachments', 3);

// Middleware para manejar errores de upload
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Demasiados archivos. Máximo permitido: 10'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Campo de archivo inesperado'
      });
    }
  }
  
  if (error.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Función para eliminar archivos
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Función para eliminar múltiples archivos
const deleteFiles = async (filePaths) => {
  const deletePromises = filePaths.map(filePath => deleteFile(filePath));
  return Promise.allSettled(deletePromises);
};

// Middleware para optimizar imágenes (opcional, requiere sharp)
const optimizeImage = async (req, res, next) => {
  if (!req.files && !req.file) {
    return next();
  }
  
  try {
    // Esta funcionalidad requiere el paquete 'sharp'
    // npm install sharp
    // const sharp = require('sharp');
    
    const files = req.files || [req.file];
    
    for (const file of files) {
      if (file && file.mimetype.startsWith('image/')) {
        // Aquí se podría implementar la optimización con sharp
        // const optimizedBuffer = await sharp(file.path)
        //   .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        //   .jpeg({ quality: 85 })
        //   .toBuffer();
        // 
        // await fs.promises.writeFile(file.path, optimizedBuffer);
      }
    }
    
    next();
  } catch (error) {
    console.error('Error optimizando imágenes:', error);
    next(); // Continuar aunque falle la optimización
  }
};

// Función helper para generar URL pública del archivo
const getFileUrl = (filePath, req) => {
  if (!filePath) return null;
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/${filePath.replace(/\\/g, '/')}`;
};

module.exports = {
  upload,
  uploadProductImages,
  uploadUserAvatar,
  uploadReviewImages,
  uploadContactAttachments,
  handleUploadError,
  deleteFile,
  deleteFiles,
  optimizeImage,
  getFileUrl
};