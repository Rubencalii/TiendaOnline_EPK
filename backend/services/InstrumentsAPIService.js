const axios = require('axios');

class InstrumentsAPIService {
  constructor() {
    this.reverbAPI = 'https://reverb.com/api';
    this.musicBrainzAPI = 'https://musicbrainz.org/ws/2';
  }

  // Función para obtener instrumentos de Reverb API
  async getReverbInstruments(category = '', page = 1, limit = 20) {
    try {
      const response = await axios.get(`${this.reverbAPI}/listings`, {
        params: {
          category,
          page,
          per_page: limit,
          // Añadir API key si la tienes
          // api_key: process.env.REVERB_API_KEY
        },
        headers: {
          'User-Agent': 'EPK-Musica-Store/1.0',
          'Accept': 'application/hal+json'
        }
      });

      return response.data.listings?.map(listing => ({
        name: listing.title,
        brand: listing.make,
        model: listing.model,
        category: this.mapReverbCategory(listing.category),
        price: parseFloat(listing.price?.amount || 0),
        description: listing.description,
        images: listing.photos?.map(photo => photo.full) || [],
        condition: listing.condition,
        year: listing.year,
        location: listing.shop?.location,
        rating: 4.0 + Math.random(), // Simulado
        inStock: true,
        featured: Math.random() > 0.8
      })) || [];

    } catch (error) {
      console.warn('Error fetching from Reverb API:', error.message);
      return [];
    }
  }

  // Función para obtener datos de MusicBrainz
  async getMusicBrainzInstruments(instrument = 'guitar') {
    try {
      const response = await axios.get(`${this.musicBrainzAPI}/instrument`, {
        params: {
          query: instrument,
          fmt: 'json',
          limit: 25
        },
        headers: {
          'User-Agent': 'EPK-Musica-Store/1.0 (contacto@epkmusica.com)'
        }
      });

      return response.data.instruments?.map(instrument => ({
        name: instrument.name,
        type: instrument.type,
        description: instrument.description || `${instrument.name} - Instrumento musical profesional`,
        category: this.mapMusicBrainzType(instrument.type),
        // Generar precio simulado basado en el tipo
        price: this.generatePriceByType(instrument.type),
        brand: 'Varios',
        model: instrument.name,
        rating: 4.0 + Math.random(),
        inStock: true,
        featured: false
      })) || [];

    } catch (error) {
      console.warn('Error fetching from MusicBrainz API:', error.message);
      return [];
    }
  }

  // Mapear categorías de Reverb a nuestro sistema
  mapReverbCategory(reverbCategory) {
    const categoryMap = {
      'electric-guitars': 'guitarras',
      'acoustic-guitars': 'guitarras',
      'bass-guitars': 'bajos',
      'drums': 'bateria',
      'keyboards': 'teclados',
      'microphones': 'microfonos',
      'amplifiers': 'amplificadores',
      'effects': 'efectos',
      'recording': 'grabacion'
    };

    return categoryMap[reverbCategory] || 'otros';
  }

  // Mapear tipos de MusicBrainz a nuestras categorías
  mapMusicBrainzType(type) {
    if (!type) return 'otros';
    
    const typeStr = type.toLowerCase();
    
    if (typeStr.includes('guitar')) return 'guitarras';
    if (typeStr.includes('bass')) return 'bajos';
    if (typeStr.includes('drum')) return 'bateria';
    if (typeStr.includes('piano') || typeStr.includes('keyboard')) return 'teclados';
    if (typeStr.includes('microphone')) return 'microfonos';
    if (typeStr.includes('amplifier')) return 'amplificadores';
    
    return 'otros';
  }

  // Generar precio basado en el tipo de instrumento
  generatePriceByType(type) {
    const priceRanges = {
      'guitarras': { min: 150, max: 3000 },
      'bajos': { min: 200, max: 2500 },
      'bateria': { min: 300, max: 5000 },
      'teclados': { min: 100, max: 4000 },
      'microfonos': { min: 50, max: 800 },
      'amplificadores': { min: 100, max: 2000 },
      'otros': { min: 50, max: 1000 }
    };

    const category = this.mapMusicBrainzType(type);
    const range = priceRanges[category] || priceRanges.otros;
    
    return Math.round((Math.random() * (range.max - range.min) + range.min) * 100) / 100;
  }

  // Función principal para obtener instrumentos de múltiples fuentes
  async getInstrumentsFromAPIs(options = {}) {
    const {
      useReverb = false, // Requiere API key
      useMusicBrainz = true,
      category = '',
      limit = 50
    } = options;

    let allInstruments = [];

    try {
      // Intentar obtener de MusicBrainz (gratuita)
      if (useMusicBrainz) {
        console.log('🎵 Obteniendo instrumentos de MusicBrainz...');
        const mbInstruments = await this.getMusicBrainzInstruments();
        allInstruments.push(...mbInstruments);
      }

      // Intentar obtener de Reverb (requiere API key)
      if (useReverb && process.env.REVERB_API_KEY) {
        console.log('🎸 Obteniendo instrumentos de Reverb...');
        const reverbInstruments = await this.getReverbInstruments(category);
        allInstruments.push(...reverbInstruments);
      }

      // Limitar resultados
      allInstruments = allInstruments.slice(0, limit);

      console.log(`✅ Obtenidos ${allInstruments.length} instrumentos de APIs externas`);
      return allInstruments;

    } catch (error) {
      console.error('Error obteniendo instrumentos de APIs:', error);
      return [];
    }
  }

  // Función para enriquecer datos existentes con información de APIs
  async enrichProductData(product) {
    try {
      // Buscar información adicional en MusicBrainz
      const searchQuery = `${product.brand} ${product.model}`.trim();
      
      const response = await axios.get(`${this.musicBrainzAPI}/instrument`, {
        params: {
          query: searchQuery,
          fmt: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'EPK-Musica-Store/1.0 (contacto@epkmusica.com)'
        }
      });

      const enrichedData = response.data.instruments?.[0];
      
      if (enrichedData) {
        return {
          ...product,
          additionalInfo: {
            musicbrainz_id: enrichedData.id,
            type_detail: enrichedData.type,
            aliases: enrichedData.aliases?.map(alias => alias.name) || []
          }
        };
      }

      return product;

    } catch (error) {
      console.warn(`No se pudo enriquecer datos para ${product.name}:`, error.message);
      return product;
    }
  }
}

module.exports = InstrumentsAPIService;