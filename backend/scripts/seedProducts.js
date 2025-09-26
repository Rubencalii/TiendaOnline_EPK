const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const { getAllInstruments } = require('../data/instrumentsData');
require('dotenv').config();

const seedProducts = async () => {
  try {
    console.log('🎵 Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/epk_musica');
    
    console.log('🗑️  Limpiando productos existentes...');
    await Product.deleteMany({});
    
    console.log('🎸 Cargando datos de instrumentos...');
    const instrumentsData = getAllInstruments();
    
    console.log(`📦 Insertando ${instrumentsData.length} productos...`);
    const insertedProducts = await Product.insertMany(instrumentsData);
    
    console.log(`✅ ${insertedProducts.length} productos insertados correctamente:`);
    
    // Mostrar resumen por categorías
    const categories = {};
    insertedProducts.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   📊 ${category}: ${count} productos`);
    });
    
    console.log('\n🎉 Base de datos poblada correctamente con instrumentos musicales!');
    console.log('\n🏪 Productos destacados:');
    const featured = insertedProducts.filter(p => p.featured);
    featured.forEach(product => {
      console.log(`   ⭐ ${product.name} - €${product.price}`);
    });
    
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión a la base de datos cerrada.');
    process.exit(0);
  }
};

// Ejecutar el seeder si se llama directamente
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts };