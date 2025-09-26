// Servicio compartido para productos - Frontend
import { mockProducts } from './mockData'

class ProductService {
  constructor() {
    // En el futuro, esto se conectará con el backend
    this.baseURL = 'http://localhost:5000/api' // Cuando tengamos backend
    this.products = mockProducts // Por ahora usamos datos mock
  }

  // Obtener todos los productos
  async getAllProducts(options = {}) {
    try {
      const { 
        category = null, 
        featured = null, 
        limit = null, 
        search = null,
        minPrice = null,
        maxPrice = null 
      } = options

      let filtered = [...this.products]

      // Filtrar por categoría
      if (category && category !== 'all') {
        filtered = filtered.filter(product => product.category === category)
      }

      // Filtrar por destacados
      if (featured !== null) {
        filtered = filtered.filter(product => product.featured === featured)
      }

      // Filtrar por búsqueda
      if (search) {
        const searchTerm = search.toLowerCase()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }

      // Filtrar por precio
      if (minPrice !== null) {
        filtered = filtered.filter(product => product.price >= minPrice)
      }
      if (maxPrice !== null) {
        filtered = filtered.filter(product => product.price <= maxPrice)
      }

      // Limitar resultados
      if (limit) {
        filtered = filtered.slice(0, limit)
      }

      return {
        success: true,
        data: filtered,
        total: filtered.length,
        message: `${filtered.length} productos encontrados`
      }
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      return {
        success: false,
        data: [],
        total: 0,
        message: 'Error al cargar productos'
      }
    }
  }

  // Obtener producto por ID
  async getProductById(id) {
    try {
      const product = this.products.find(p => p._id === id || p.sku === id)
      
      if (!product) {
        return {
          success: false,
          data: null,
          message: 'Producto no encontrado'
        }
      }

      return {
        success: true,
        data: product,
        message: 'Producto encontrado'
      }
    } catch (error) {
      console.error('Error obteniendo producto:', error)
      return {
        success: false,
        data: null,
        message: 'Error al cargar producto'
      }
    }
  }

  // Obtener productos destacados
  async getFeaturedProducts(limit = 6) {
    return this.getAllProducts({ featured: true, limit })
  }

  // Obtener productos por categoría
  async getProductsByCategory(category, limit = 12) {
    return this.getAllProducts({ category, limit })
  }

  // Buscar productos
  async searchProducts(query, options = {}) {
    return this.getAllProducts({ ...options, search: query })
  }

  // Obtener categorías disponibles
  async getCategories() {
    try {
      const categories = [...new Set(this.products.map(p => p.category))]
      const categoriesWithCount = categories.map(category => ({
        name: category,
        label: this.getCategoryLabel(category),
        count: this.products.filter(p => p.category === category).length
      }))

      return {
        success: true,
        data: categoriesWithCount,
        message: 'Categorías obtenidas'
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error al cargar categorías'
      }
    }
  }

  // Obtener estadísticas para la home
  async getHomeStats() {
    try {
      const totalProducts = this.products.length
      const featuredProducts = this.products.filter(p => p.featured).length
      const categories = [...new Set(this.products.map(p => p.category))].length
      const averageRating = this.products.reduce((sum, p) => sum + p.rating, 0) / totalProducts

      return {
        success: true,
        data: {
          totalProducts,
          featuredProducts,
          categories,
          averageRating: Math.round(averageRating * 10) / 10,
          bestSellers: this.products
            .filter(p => p.reviews > 50)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
        },
        message: 'Estadísticas obtenidas'
      }
    } catch (error) {
      return {
        success: false,
        data: {},
        message: 'Error al cargar estadísticas'
      }
    }
  }

  // Mapear nombres de categorías
  getCategoryLabel(category) {
    const categoryMap = {
      'guitarras': 'Guitarras',
      'bajos': 'Bajos',
      'bateria': 'Batería',
      'teclados': 'Teclados',
      'microfonos': 'Micrófonos',
      'amplificadores': 'Amplificadores',
      'efectos': 'Efectos',
      'grabacion': 'Grabación',
      'iluminacion': 'Iluminación',
      'otros': 'Otros'
    }
    return categoryMap[category] || category
  }

  // Formatear precio
  formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  // Calcular descuento
  calculateDiscount(price, originalPrice) {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }
}

// Instancia singleton del servicio
export const productService = new ProductService()
export default productService