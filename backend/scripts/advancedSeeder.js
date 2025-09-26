const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const InstrumentsAPIService = require('../services/InstrumentsAPIService');
const { getAllInstruments } = require('../data/instrumentsData');
require('dotenv').config();

class ProductSeeder {
  constructor() {
    this.apiService = new InstrumentsAPIService();
  }

  async seedFromMultipleSources() {
    try {
      console.log('🎵 Conectando a la base de datos...');
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/epk_musica');
      
      console.log('🗑️  Limpiando productos existentes...');
      await Product.deleteMany({});
      
      // 1. Cargar datos locales (siempre disponibles)
      console.log('📦 Cargando datos locales de instrumentos...');
      const localInstruments = getAllInstruments();
      console.log(`   ✅ ${localInstruments.length} productos locales cargados`);
      
      // 2. Intentar cargar datos de APIs externas
      console.log('🌐 Intentando obtener datos de APIs externas...');
      let apiInstruments = [];
      
      try {
        apiInstruments = await this.apiService.getInstrumentsFromAPIs({
          useMusicBrainz: true,
          useReverb: false, // Cambiar a true si tienes API key de Reverb
          limit: 20
        });
        
        if (apiInstruments.length > 0) {
          console.log(`   ✅ ${apiInstruments.length} productos obtenidos de APIs externas`);
        } else {
          console.log('   ⚠️  No se obtuvieron productos de APIs externas');
        }
      } catch (error) {
        console.warn('   ⚠️  Error al obtener datos de APIs externas:', error.message);
      }
      
      // 3. Combinar datos locales y de APIs
      const allProducts = [...localInstruments];
      
      // Añadir productos de APIs que no sean duplicados
      for (const apiProduct of apiInstruments) {
        const isDuplicate = allProducts.some(local => 
          local.name.toLowerCase().includes(apiProduct.name.toLowerCase()) ||
          apiProduct.name.toLowerCase().includes(local.name.toLowerCase())
        );
        
        if (!isDuplicate) {
          // Formatear producto de API para que coincida con nuestro esquema
          const formattedProduct = this.formatAPIProduct(apiProduct);
          allProducts.push(formattedProduct);
        }
      }
      
      console.log(`📊 Total de productos únicos: ${allProducts.length}`);
      
      // 4. Insertar productos en la base de datos
      console.log('💾 Insertando productos en la base de datos...');
      const insertedProducts = await Product.insertMany(allProducts);
      
      console.log(`✅ ${insertedProducts.length} productos insertados correctamente`);
      
      // 5. Mostrar resumen
      await this.showSummary(insertedProducts);
      
    } catch (error) {
      console.error('❌ Error en el seeding:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
      console.log('🔌 Conexión cerrada.');
      process.exit(0);
    }
  }

  // Formatear producto de API para que coincida con nuestro esquema
  formatAPIProduct(apiProduct) {
    return {
      name: apiProduct.name || 'Producto sin nombre',
      brand: apiProduct.brand || 'Marca no especificada',
      model: apiProduct.model || apiProduct.name,
      category: apiProduct.category || 'otros',
      subcategory: 'general',
      price: apiProduct.price || 99.99,
      description: apiProduct.description || `${apiProduct.name} - Instrumento musical de calidad`,
      specifications: {
        type: apiProduct.type || 'No especificado',
        condition: apiProduct.condition || 'Nuevo'
      },
      features: ['Calidad profesional', 'Sonido excepcional'],
      stock: Math.floor(Math.random() * 20) + 5,
      images: apiProduct.images?.slice(0, 3) || [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
      ],
      colors: ['Estándar'],
      rating: apiProduct.rating || (4.0 + Math.random()),
      reviews: Math.floor(Math.random() * 50) + 10,
      inStock: true,
      featured: apiProduct.featured || false,
      tags: ['api-sourced', apiProduct.category || 'general'],
      source: 'API',
      _id: undefined, // Dejar que MongoDB genere el ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: (apiProduct.name || 'producto').toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, ''),
      sku: `EPK-API-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      weight: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
      dimensions: {
        length: Math.round((Math.random() * 50 + 20) * 100) / 100,
        width: Math.round((Math.random() * 30 + 10) * 100) / 100,
        height: Math.round((Math.random() * 20 + 5) * 100) / 100
      },
      warranty: '1 año',
      status: 'active'
    };
  }

  // Mostrar resumen de productos insertados
  async showSummary(products) {
    console.log('\n📊 RESUMEN DE PRODUCTOS:');
    console.log('========================');
    
    // Resumen por categorías
    const categories = {};
    const sources = { local: 0, api: 0 };
    let totalValue = 0;
    
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
      sources[product.source === 'API' ? 'api' : 'local']++;
      totalValue += product.price * product.stock;
    });
    
    console.log('\n📦 Por categorías:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category.padEnd(15)}: ${count} productos`);
    });
    
    console.log('\n🔄 Por fuentes:');
    console.log(`   Datos locales    : ${sources.local} productos`);
    console.log(`   APIs externas    : ${sources.api} productos`);
    
    console.log('\n💰 Valor del inventario:');
    console.log(`   Total estimado   : €${totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`);
    
    console.log('\n⭐ Productos destacados:');
    const featured = products.filter(p => p.featured).slice(0, 5);
    featured.forEach(product => {
      console.log(`   🌟 ${product.name} - €${product.price}`);
    });
    
    console.log('\n🏆 Marcas más representadas:');
    const brands = {};
    products.forEach(p => {
      brands[p.brand] = (brands[p.brand] || 0) + 1;
    });
    
    Object.entries(brands)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([brand, count]) => {
        console.log(`   ${brand.padEnd(15)}: ${count} productos`);
      });
  }

  // Método para actualizar productos existentes con datos de APIs
  async updateWithAPIData() {
    try {
      console.log('🎵 Conectando a la base de datos...');
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/epk_musica');
      
      console.log('🔍 Buscando productos existentes...');
      const existingProducts = await Product.find({});
      
      console.log(`📦 Encontrados ${existingProducts.length} productos existentes`);
      console.log('🌐 Enriqueciendo con datos de APIs...');
      
      let updatedCount = 0;
      
      for (const product of existingProducts) {
        try {
          const enrichedProduct = await this.apiService.enrichProductData(product.toObject());
          
          if (enrichedProduct.additionalInfo) {
            await Product.findByIdAndUpdate(
              product._id,
              { additionalInfo: enrichedProduct.additionalInfo },
              { new: true }
            );
            updatedCount++;
            
            if (updatedCount % 5 === 0) {
              console.log(`   ✅ ${updatedCount} productos enriquecidos...`);
            }
          }
          
          // Respetar límites de API (1 req/sec para MusicBrainz)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.warn(`   ⚠️  Error enriqueciendo ${product.name}: ${error.message}`);
        }
      }
      
      console.log(`✅ Total de productos enriquecidos: ${updatedCount}`);
      
    } catch (error) {
      console.error('❌ Error actualizando productos:', error);
    } finally {
      await mongoose.connection.close();
      console.log('🔌 Conexión cerrada.');
    }
  }
}

// Ejecutar el seeder apropiado según los argumentos
const seeder = new ProductSeeder();

const command = process.argv[2];

if (command === 'update') {
  seeder.updateWithAPIData();
} else {
  seeder.seedFromMultipleSources();
}

module.exports = ProductSeeder;