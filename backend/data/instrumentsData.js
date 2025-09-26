const instrumentsData = {
  guitars: [
    {
      name: 'Fender Player Stratocaster',
      brand: 'Fender',
      model: 'Player Stratocaster',
      category: 'guitarras',
      subcategory: 'electricas',
      price: 699.99,
      originalPrice: 799.99,
      description: 'Guitarra eléctrica Stratocaster con pastillas Player Series Alnico V y puente de trémolo de dos puntos.',
      specifications: {
        body: 'Aliso',
        neck: 'Arce',
        fretboard: 'Pau Ferro',
        frets: 22,
        pickups: '3 pastillas single-coil Player Series Alnico V',
        bridge: 'Trémolo de 2 puntos con selletas de bloque',
        tuners: 'Estándar',
        controls: '1 Volumen, 2 Tonos, Selector 5 posiciones'
      },
      features: ['Nuevo diseño de pastillas Player Series', 'Puente mejorado', 'Acabado brillante'],
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800'
      ],
      colors: ['Polar White', '3-Color Sunburst', 'Black', 'Buttercream'],
      rating: 4.7,
      reviews: 89,
      inStock: true,
      featured: true,
      tags: ['popular', 'profesional', 'versatil']
    },
    {
      name: 'Gibson Les Paul Standard',
      brand: 'Gibson',
      model: 'Les Paul Standard',
      category: 'guitarras',
      subcategory: 'electricas',
      price: 2499.99,
      description: 'La legendaria Les Paul Standard con pastillas humbuckers y acabado AAA flame maple.',
      specifications: {
        body: 'Caoba con tapa de arce flameado',
        neck: 'Caoba',
        fretboard: 'Rosewood',
        frets: 22,
        pickups: '2 Humbuckers 490R y 498T',
        bridge: 'Tune-O-Matic con tailpiece',
        tuners: 'Grover Rotomatic',
        controls: '2 Volúmenes, 2 Tonos, Selector 3 posiciones'
      },
      features: ['Tapa de arce flameado AAA', 'Pastillas Gibson 490/498', 'Acabado nitrocelulosa'],
      stock: 8,
      images: [
        'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800',
        'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800'
      ],
      colors: ['Heritage Cherry Sunburst', 'Honey Burst', 'Tobacco Sunburst'],
      rating: 4.9,
      reviews: 156,
      inStock: true,
      featured: true,
      tags: ['premium', 'clasico', 'rock']
    },
    {
      name: 'Yamaha FG830 Acoustic',
      brand: 'Yamaha',
      model: 'FG830',
      category: 'guitarras',
      subcategory: 'acusticas',
      price: 299.99,
      description: 'Guitarra acústica con tapa de abeto macizo y aros y fondo de rosewood.',
      specifications: {
        body: 'Dreadnought',
        top: 'Abeto macizo',
        back: 'Rosewood',
        sides: 'Rosewood',
        neck: 'Nato',
        fretboard: 'Rosewood',
        frets: 20,
        bridge: 'Rosewood'
      },
      features: ['Tapa de abeto macizo', 'Sonido equilibrado', 'Excelente relación calidad-precio'],
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800',
        'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=800'
      ],
      colors: ['Natural'],
      rating: 4.6,
      reviews: 234,
      inStock: true,
      featured: false,
      tags: ['principiante', 'versatil', 'acustica']
    }
  ],
  basses: [
    {
      name: 'Fender Player Precision Bass',
      brand: 'Fender',
      model: 'Player Precision Bass',
      category: 'bajos',
      subcategory: 'electricos',
      price: 799.99,
      description: 'Bajo eléctrico de 4 cuerdas con el sonido clásico Precision Bass.',
      specifications: {
        body: 'Aliso',
        neck: 'Arce',
        fretboard: 'Pau Ferro',
        frets: 20,
        pickups: '1 Pastilla split-coil Player Series',
        bridge: 'Estándar de 4 selletas',
        tuners: 'Estándar cerrados',
        scale: '34" (864 mm)'
      },
      features: ['Sonido P-Bass clásico', 'Mástil cómodo', 'Versatilidad tonal'],
      stock: 12,
      images: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
      ],
      colors: ['Black', '3-Color Sunburst', 'Polar White'],
      rating: 4.8,
      reviews: 67,
      inStock: true,
      featured: false,
      tags: ['bajo', 'clasico', 'versatil']
    }
  ],
  drums: [
    {
      name: 'Pearl Export EXX Drum Kit',
      brand: 'Pearl',
      model: 'Export EXX',
      category: 'bateria',
      subcategory: 'acustica',
      price: 899.99,
      description: 'Batería completa de 5 piezas ideal para principiantes y músicos intermedios.',
      specifications: {
        shells: 'Álamo/Asian Mahogany',
        finish: 'Wrap',
        sizes: '22"x18" BD, 10"x7" TT, 12"x8" TT, 16"x16" FT, 14"x5.5" SD',
        hardware: 'Cromado',
        heads: 'Remo'
      },
      features: ['Cascos de álamo', 'Hardware cromado', 'Sonido potente'],
      stock: 6,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
      ],
      colors: ['Jet Black', 'Smokey Chrome', 'Arctic Sparkle'],
      rating: 4.5,
      reviews: 43,
      inStock: true,
      featured: false,
      tags: ['bateria', 'completo', 'principiante']
    }
  ],
  keyboards: [
    {
      name: 'Yamaha P-125 Digital Piano',
      brand: 'Yamaha',
      model: 'P-125',
      category: 'teclados',
      subcategory: 'pianos-digitales',
      price: 649.99,
      description: 'Piano digital de 88 teclas con acción GHS y sonidos Pure CF.',
      specifications: {
        keys: '88 teclas contrapesadas GHS',
        voices: '24 voces',
        polyphony: '192 notas',
        effects: 'Reverb, Chorus, Brilliant, Effect',
        connectivity: 'USB to Host, Sustain Pedal, Phones',
        speakers: '2 x 7W'
      },
      features: ['Acción GHS', 'Sonidos Pure CF', 'App Smart Pianist'],
      stock: 18,
      images: [
        'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800'
      ],
      colors: ['Black', 'White'],
      rating: 4.7,
      reviews: 92,
      inStock: true,
      featured: true,
      tags: ['piano', 'digital', 'portatil']
    }
  ],
  microphones: [
    {
      name: 'Shure SM58 Dynamic Microphone',
      brand: 'Shure',
      model: 'SM58',
      category: 'microfonos',
      subcategory: 'dinamicos',
      price: 99.99,
      description: 'Micrófono dinámico cardioide, estándar de la industria para voces en vivo.',
      specifications: {
        type: 'Dinámico',
        pattern: 'Cardioide',
        frequency: '50 Hz - 15 kHz',
        sensitivity: '-54.5 dBV/Pa',
        impedance: '300 Ohms',
        connector: 'XLR'
      },
      features: ['Patrón cardioide', 'Construcción robusta', 'Filtro anti-pop integrado'],
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800'
      ],
      colors: ['Black'],
      rating: 4.9,
      reviews: 312,
      inStock: true,
      featured: true,
      tags: ['microfono', 'vocal', 'profesional']
    }
  ],
  amplifiers: [
    {
      name: 'Fender Blues Junior IV',
      brand: 'Fender',
      model: 'Blues Junior IV',
      category: 'amplificadores',
      subcategory: 'guitarra',
      price: 399.99,
      description: 'Amplificador de tubos de 15W con el clásico sonido Fender.',
      specifications: {
        power: '15W',
        tubes: '3 x 12AX7, 2 x EL84',
        speaker: '12" Jensen C-12K',
        channels: '1 canal con Volume, Treble, Bass, Middle, Master, Reverb',
        effects: 'Reverb de resorte',
        dimensions: '16" x 15" x 9"'
      },
      features: ['Tubos de alta calidad', 'Reverb de resorte', 'Sonido clásico Fender'],
      stock: 10,
      images: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
      ],
      colors: ['Black', 'Lacquered Tweed'],
      rating: 4.6,
      reviews: 78,
      inStock: true,
      featured: false,
      tags: ['amplificador', 'tubos', 'blues']
    }
  ]
};

// Función para obtener todos los productos
const getAllInstruments = () => {
  const allProducts = [];
  
  Object.values(instrumentsData).forEach(category => {
    allProducts.push(...category);
  });
  
  // Añadir ID único a cada producto
  return allProducts.map((product, index) => ({
    ...product,
    _id: `product_${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date().toISOString(),
    slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    sku: `EPK-${String(index + 1).padStart(4, '0')}`,
    weight: Math.round((Math.random() * 5 + 0.5) * 100) / 100, // 0.5-5.5 kg
    dimensions: {
      length: Math.round((Math.random() * 50 + 20) * 100) / 100,
      width: Math.round((Math.random() * 30 + 10) * 100) / 100,
      height: Math.round((Math.random() * 20 + 5) * 100) / 100
    },
    warranty: '2 años',
    status: 'active'
  }));
};

// Función para obtener productos por categoría
const getInstrumentsByCategory = (category) => {
  return instrumentsData[category] || [];
};

// Función para obtener productos destacados
const getFeaturedInstruments = () => {
  return getAllInstruments().filter(product => product.featured);
};

// Función para buscar productos
const searchInstruments = (query) => {
  const allProducts = getAllInstruments();
  const searchTerm = query.toLowerCase();
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

module.exports = {
  instrumentsData,
  getAllInstruments,
  getInstrumentsByCategory,
  getFeaturedInstruments,
  searchInstruments
};