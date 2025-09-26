# Backend - Tienda Online Epk Música

Backend API REST para la tienda online de Epk Música, especializada en instrumentos musicales, sonido e iluminación, vinculada con la Orquesta Époka de Atarfe, Granada.

## 🎵 Características

- **API REST completa** con endpoints para productos, usuarios, pedidos, alquileres, reseñas, contacto y newsletter
- **Autenticación JWT** con roles de usuario (cliente, empleado, admin)
- **Sistema de productos** con categorías, filtros, búsqueda y gestión de stock
- **Carrito de compras** persistente por usuario
- **Sistema de pedidos** con seguimiento de estados y notificaciones
- **Alquiler de equipos** para eventos con gestión de disponibilidad
- **Sistema de reseñas** con moderación y calificaciones
- **Contacto y soporte** con sistema de tickets
- **Newsletter** con segmentación y campañas
- **Subida de archivos** para imágenes de productos y documentos
- **Validación robusta** de datos de entrada
- **Middleware de seguridad** con rate limiting y protección

## 🛠️ Tecnologías

- **Node.js** + **Express** - Framework web
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **Multer** - Subida de archivos
- **Bcrypt** - Hash de contraseñas
- **Nodemailer** - Envío de emails
- **Stripe** - Procesamiento de pagos
- **Express Validator** - Validación de datos
- **Helmet** - Seguridad
- **CORS** - Cross-Origin Resource Sharing

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js 16+ 
- MongoDB 5+
- NPM o Yarn

### Pasos de instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Configurar MongoDB:**
- Instalar MongoDB localmente o usar MongoDB Atlas
- Crear base de datos `epk_musica`
- Actualizar `MONGODB_URI` en `.env`

4. **Configurar servicios externos:**
- **Stripe:** Crear cuenta y obtener claves API
- **Email:** Configurar SMTP (Gmail, SendGrid, etc.)
- **PayPal:** Configurar para pagos (opcional)

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Middlewares personalizados
│   │   ├── auth.js      # Autenticación JWT
│   │   ├── upload.js    # Subida de archivos
│   │   └── validation.js # Validación de datos
│   ├── models/          # Modelos de Mongoose
│   │   ├── User.js      # Usuario
│   │   ├── Product.js   # Producto
│   │   ├── Order.js     # Pedido
│   │   ├── Rental.js    # Alquiler
│   │   ├── Review.js    # Reseña
│   │   ├── Contact.js   # Contacto
│   │   └── Newsletter.js # Newsletter
│   └── routes/          # Rutas de la API
│       ├── auth.js      # Autenticación
│       ├── products.js  # Productos
│       ├── orders.js    # Pedidos
│       ├── rentals.js   # Alquileres
│       ├── reviews.js   # Reseñas
│       ├── contact.js   # Contacto
│       └── newsletter.js # Newsletter
├── uploads/             # Archivos subidos
├── .env.example         # Variables de entorno ejemplo
├── server.js            # Servidor principal
└── package.json         # Dependencias
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Productos
- `GET /api/products` - Listar productos (filtros, búsqueda, paginación)
- `GET /api/products/featured` - Productos destacados
- `GET /api/products/on-sale` - Productos en oferta
- `GET /api/products/categories` - Categorías disponibles
- `GET /api/products/:id` - Detalle de producto
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)

### Pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders` - Pedidos del usuario
- `GET /api/orders/:id` - Detalle de pedido
- `PUT /api/orders/:id/cancel` - Cancelar pedido
- `GET /api/orders/admin/all` - Todos los pedidos (Admin)
- `PUT /api/orders/:id/status` - Actualizar estado (Admin)

### Alquileres
- `GET /api/rentals/equipment` - Equipos disponibles
- `POST /api/rentals/quote` - Cotizar alquiler
- `POST /api/rentals` - Crear alquiler
- `GET /api/rentals` - Alquileres del usuario
- `GET /api/rentals/:id` - Detalle de alquiler
- `PUT /api/rentals/:id/extend` - Extender alquiler

### Reseñas
- `GET /api/reviews/product/:productId` - Reseñas de producto
- `POST /api/reviews/product/:productId` - Crear reseña
- `POST /api/reviews/:id/helpful` - Marcar como útil
- `POST /api/reviews/:id/report` - Reportar reseña

### Contacto
- `POST /api/contact` - Enviar mensaje
- `GET /api/contact/categories` - Categorías disponibles
- `GET /api/contact/admin/all` - Todos los mensajes (Admin)
- `POST /api/contact/admin/:id/reply` - Responder mensaje (Admin)

### Newsletter
- `POST /api/newsletter/subscribe` - Suscribirse
- `POST /api/newsletter/unsubscribe/:token` - Desuscribirse
- `GET /api/newsletter/admin/subscribers` - Suscriptores (Admin)
- `POST /api/newsletter/admin/send-campaign` - Enviar campaña (Admin)

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación:

1. **Login:** El usuario envía email/contraseña
2. **Token:** El servidor devuelve un JWT válido por 7 días
3. **Autorización:** Incluir token en header: `Authorization: Bearer <token>`

### Roles de usuario:
- **customer** - Cliente normal
- **employee** - Empleado de la tienda
- **admin** - Administrador total

## 📦 Modelos de Datos

### Usuario (User)
- Información personal y contacto
- Dirección de envío
- Carrito de compras persistente
- Lista de deseos
- Preferencias

### Producto (Product)
- Información básica y especificaciones
- Categorización y etiquetado
- Gestión de stock
- Precios y ofertas
- Disponibilidad para alquiler
- SEO y optimización

### Pedido (Order)
- Items del pedido
- Información de envío y facturación
- Estado del pedido y tracking
- Métodos de pago
- Historial de cambios

### Alquiler (Rental)
- Equipos alquilados
- Período de alquiler
- Información del evento
- Depósito y pricing
- Estados y seguimiento

## 🛡️ Seguridad

- **Helmet:** Headers de seguridad HTTP
- **Rate Limiting:** Límite de requests por IP
- **CORS:** Configurado para dominios específicos
- **Validación:** Sanitización de todos los inputs
- **Hashing:** Contraseñas hasheadas con bcrypt
- **JWT:** Tokens seguros con expiración
- **File Upload:** Validación de tipos y tamaños

## 📧 Notificaciones

El sistema puede enviar emails para:
- Confirmación de registro
- Recuperación de contraseña
- Confirmación de pedidos
- Updates de estado de pedido
- Confirmación de alquileres
- Respuestas a contactos
- Campañas de newsletter

## 🧪 Testing

```bash
npm test
```

## 📈 Monitoreo

- Logs de errores en consola
- Tracking de performance
- Métricas de uso de API
- Alertas de errores críticos

## 🚀 Despliegue

### Variables de entorno para producción:
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB Atlas o instancia dedicada
- `JWT_SECRET` - Clave secreta robusta
- `STRIPE_SECRET_KEY` - Claves de Stripe en vivo
- Configuración de email production

### Servicios recomendados:
- **Hosting:** Heroku, DigitalOcean, AWS
- **Base de datos:** MongoDB Atlas
- **Files:** AWS S3, Cloudinary
- **Email:** SendGrid, Mailgun
- **Monitoring:** New Relic, DataDog

## 👥 Equipo

Desarrollado para **Epk Música** - Tienda de instrumentos musicales, sonido e iluminación
- 📍 Ubicación: Atarfe, Granada, España  
- 🎭 Vinculada con la **Orquesta Époka**
- 🎵 Especializada en música y espectáculos

## 📞 Soporte

Para soporte técnico o consultas sobre el backend:
- Email: soporte@epkmusica.es
- Documentación: `/api` (endpoint de bienvenida)
- Issues: Reportar en el repositorio

---

**¡Música, tecnología y pasión por el espectáculo!** 🎵✨