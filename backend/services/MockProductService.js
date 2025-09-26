// Simulación de API para desarrollo sin base de datos
const { getAllInstruments, getInstrumentsByCategory, getFeaturedInstruments, searchInstruments } = require('../data/instrumentsData');

class MockProductService {
  constructor() {
    this.products = getAllInstruments();
    console.log('🎵 Mock Product Service initialized with', this.products.length, 'products');
  }

  // Simular inserción en base de datos
  async createProduct(productData) {
    const newProduct = {
      ...productData,
      _id: `mock_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  // Obtener todos los productos
  async getAllProducts(options = {}) {
    const { page = 1, limit = 20, category, search, featured } = options;
    
    let filtered = [...this.products];
    
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    if (featured) {
      filtered = filtered.filter(p => p.featured);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      total: filtered.length,
      page,
      pages: Math.ceil(filtered.length / limit)
    };
  }

  // Obtener producto por ID
  async getProductById(id) {
    return this.products.find(p => p._id === id || p.sku === id);
  }

  // Actualizar producto
  async updateProduct(id, updateData) {
    const productIndex = this.products.findIndex(p => p._id === id);
    if (productIndex === -1) return null;
    
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return this.products[productIndex];
  }

  // Eliminar producto
  async deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p._id === id);
    if (productIndex === -1) return false;
    
    this.products.splice(productIndex, 1);
    return true;
  }

  // Obtener estadísticas para el dashboard
  async getStats() {
    const totalProducts = this.products.length;
    const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    
    const categories = {};
    const brands = {};
    
    this.products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
      brands[product.brand] = (brands[product.brand] || 0) + 1;
    });
    
    return {
      totalProducts,
      totalValue: Math.round(totalValue * 100) / 100,
      averagePrice: Math.round(averagePrice * 100) / 100,
      inStock: this.products.filter(p => p.inStock).length,
      outOfStock: this.products.filter(p => !p.inStock).length,
      featured: this.products.filter(p => p.featured).length,
      categories: Object.entries(categories).sort(([,a], [,b]) => b - a),
      brands: Object.entries(brands).sort(([,a], [,b]) => b - a),
      lowStock: this.products.filter(p => p.stock < 5).length
    };
  }

  // Generar datos para el frontend
  async exportForFrontend() {
    const stats = await this.getStats();
    const featuredProducts = this.products.filter(p => p.featured);
    const categories = [...new Set(this.products.map(p => p.category))];
    
    return {
      success: true,
      data: {
        products: this.products,
        stats,
        featured: featuredProducts,
        categories,
        total: this.products.length
      },
      message: `Exportados ${this.products.length} productos para el frontend`
    };
  }
}

// Instancia global del servicio mock
const mockProductService = new MockProductService();

// Función para simular el seeding sin base de datos
const simulateSeeding = async () => {
  console.log('🎵 SIMULACIÓN DE SEEDING - EPK MÚSICA');
  console.log('=====================================');
  
  const stats = await mockProductService.getStats();
  
  console.log('📊 ESTADÍSTICAS DEL CATÁLOGO:');
  console.log(`   Total productos: ${stats.totalProducts}`);
  console.log(`   Valor total: €${stats.totalValue.toLocaleString('es-ES')}`);
  console.log(`   Precio promedio: €${stats.averagePrice.toFixed(2)}`);
  console.log(`   En stock: ${stats.inStock}`);
  console.log(`   Destacados: ${stats.featured}`);
  console.log(`   Stock bajo: ${stats.lowStock}`);
  
  console.log('\n🏷️  CATEGORÍAS:');
  stats.categories.forEach(([category, count]) => {
    console.log(`   ${category.padEnd(15)}: ${count} productos`);
  });
  
  console.log('\n🏭 MARCAS PRINCIPALES:');
  stats.brands.slice(0, 5).forEach(([brand, count]) => {
    console.log(`   ${brand.padEnd(15)}: ${count} productos`);
  });
  
  console.log('\n⭐ PRODUCTOS DESTACADOS:');
  const featured = await mockProductService.getAllProducts({ featured: true });
  featured.products.forEach(product => {
    console.log(`   🌟 ${product.name} - €${product.price} (${product.brand})`);
  });
  
  console.log('\n💡 INTEGRACIÓN CON FRONTEND:');
  console.log('   ✅ Datos listos para mostrar en el admin panel');
  console.log('   ✅ API endpoints simulados disponibles');
  console.log('   ✅ Dashboard con estadísticas reales');
  
  console.log('\n🚀 PRÓXIMOS PASOS:');
  console.log('   1. Integrar con MongoDB cuando esté disponible');
  console.log('   2. Conectar APIs externas (Reverb, MusicBrainz)');
  console.log('   3. Añadir funcionalidades de imagen y búsqueda avanzada');
  
  return mockProductService.exportForFrontend();
};

module.exports = { MockProductService, mockProductService, simulateSeeding };