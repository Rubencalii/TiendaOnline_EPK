# Epk Música - Frontend

Frontend de la tienda online Epk Música, desarrollado con React, Vite y Material-UI. Una aplicación moderna para instrumentos musicales, equipos de sonido e iluminación en Granada.

## 🎵 Características

- **Diseño Musical Elegante**: Tema oscuro con colores vibrantes (negro, dorado, azul-violeta)
- **Responsive Design**: Optimizado para todos los dispositivos
- **Componentes Modernos**: Material-UI con personalización completa
- **Navegación Fluida**: React Router con animaciones suaves
- **Estado Global**: Contextos para autenticación y carrito
- **Notificaciones**: Toast notifications con tema musical
- **Animaciones CSS**: Efectos visuales inspirados en música
- **SEO Optimizado**: Meta tags y estructura semántica

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Material-UI v5** - Componentes y iconos
- **React Router v6** - Navegación
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animaciones
- **React Hook Form** - Manejo de formularios
- **React Query** - Gestión de estado servidor
- **Zustand** - Estado global ligero
- **React Hot Toast** - Notificaciones
- **Axios** - HTTP client

## 📦 Instalación

1. **Clonar el repositorio**:
```bash
cd TiendaOnline_EPK/frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Editar `.env` con los valores correctos:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Epk Música
VITE_APP_URL=http://localhost:5173
```

4. **Iniciar el servidor de desarrollo**:
```bash
npm run dev
```

5. **Abrir en el navegador**:
```
http://localhost:5173
```

## 🏗️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint

# Utilidades
npm run start        # Alias para dev
```

## 📁 Estructura del Proyecto

```
src/
├── assets/           # Recursos estáticos
│   └── styles.css   # Estilos globales CSS
├── components/       # Componentes reutilizables
│   └── layout/      # Componentes de layout
│       ├── Navbar.jsx
│       └── Footer.jsx
├── context/         # Contextos de React
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── pages/           # Páginas de la aplicación
│   ├── auth/        # Páginas de autenticación
│   ├── Home.jsx     # Página principal
│   ├── Products.jsx # Catálogo de productos
│   ├── Cart.jsx     # Carrito de compras
│   └── ...
├── theme/           # Configuración del tema
│   └── theme.js     # Tema de Material-UI
├── utils/           # Utilidades
├── App.jsx          # Componente principal
└── main.jsx         # Punto de entrada
```

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Principal**: #5855ff (Azul-violeta)
- **Secundario**: #ffcc00 (Dorado)
- **Fondo**: #0a0a0a (Negro profundo)
- **Superficie**: rgba(255, 255, 255, 0.05)
- **Texto**: #ffffff

### Tipografía
- **Display**: Playfair Display (títulos elegantes)
- **Sans**: Inter (texto general)

### Componentes Clave
- **Botones**: Gradientes y efectos hover
- **Tarjetas**: Glass morphism con bordes luminosos
- **Animaciones**: Efectos musicales (pulse, wave, glow)
- **Loading**: Barras musicales animadas

## 🔧 Configuración

### Material-UI Theme
El tema personalizado se encuentra en `src/theme/theme.js` con:
- Paleta de colores musical
- Tipografía personalizada
- Breakpoints responsivos
- Componentes con override

### CSS Global
Estilos globales en `src/assets/styles.css`:
- Reset CSS
- Animaciones CSS musicales
- Utilidades responsive
- Efectos visuales

## 🚀 Deploy

### Desarrollo Local
```bash
npm run build
npm run preview
```

### Producción
1. **Build de producción**:
```bash
npm run build
```

2. **Los archivos generados estarán en** `dist/`

3. **Servir con cualquier servidor estático**:
```bash
# Nginx, Apache, Vercel, Netlify, etc.
```

### Variables de Entorno para Producción
```env
VITE_API_URL=https://api.epkmusica.com/api
VITE_APP_URL=https://epkmusica.com
```

## 🌟 Características del Tema Musical

### Efectos Visuales
- **Glow Effects**: Resplandor en botones y elementos activos
- **Glass Morphism**: Tarjetas con efecto de vidrio
- **Gradientes Dinámicos**: Colores que fluyen como música
- **Animaciones Rítmicas**: Movimientos inspirados en música

### Componentes Personalizados
- **Navbar Musical**: Navegación con efectos de sonido visuales
- **Footer Elegante**: Información organizada con estilo
- **Botones Interactivos**: Hover effects musicales
- **Toast Notifications**: Notificaciones temáticas

### Responsive Design
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Drawer Navigation**: Menú lateral en móviles
- **Grid Adaptativo**: Layout flexible

## 🔗 Integración con Backend

### API Endpoints
- **Autenticación**: `/auth/login`, `/auth/register`
- **Productos**: `/products`, `/products/:id`
- **Carrito**: Local storage + validación servidor
- **Newsletter**: `/newsletter/subscribe`

### Estado Global
- **AuthContext**: Manejo de usuario y sesión
- **CartContext**: Carrito de compras con persistencia

## 🐛 Debugging

### Desarrollo
```bash
# Ver logs de desarrollo
npm run dev

# Analizar bundle
npm run build -- --analyze
```

### Problemas Comunes
1. **Puerto ocupado**: Cambiar puerto en `vite.config.js`
2. **CORS**: Configurar proxy o backend
3. **Build errors**: Verificar imports y dependencias

## 📈 Performance

### Optimizaciones Incluidas
- **Code Splitting**: Lazy loading de rutas
- **Tree Shaking**: Eliminación de código muerto
- **Image Optimization**: Lazy loading de imágenes
- **Bundle Optimization**: Vite optimiza automáticamente

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch
3. Commit cambios
4. Push al branch
5. Abrir Pull Request

## 📝 Licencia

MIT License - Epk Música © 2024

## 📞 Soporte

- **Email**: info@epkmusica.com
- **Teléfono**: +34 958 123 456
- **Dirección**: Calle Principal 123, Atarfe, Granada

---

*Desarrollado con ❤️ para la música en Granada*