// Datos mock de productos - También usado en el admin
export const mockProducts = [
  {
    _id: '1',
    sku: 'FEN-STR-BLK-001',
    name: 'Fender Player Stratocaster',
    brand: 'Fender',
    category: 'guitarras',
    price: 699.99,
    originalPrice: 799.99,
    description: 'Guitarra eléctrica Stratocaster con pastillas Player, mástil de arce y cuerpo de aliso. El sonido clásico de Fender con moderna jugabilidad.',
    features: [
      'Cuerpo de Aliso',
      'Mástil de Arce',
      'Pastillas Player Series Alnico 5',
      '22 Trastes Medium Jumbo',
      'Puente Tremolo de 2 puntos'
    ],
    specifications: {
      'Material del cuerpo': 'Aliso',
      'Material del mástil': 'Arce',
      'Pastillas': 'Player Series Alnico 5 (SSS)',
      'Número de trastes': '22',
      'Escala': '25.5"',
      'Puente': 'Tremolo de 2 puntos',
      'Hardware': 'Cromado'
    },
    images: [
      'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500',
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500'
    ],
    stock: 15,
    rating: 4.8,
    reviews: 124,
    featured: true,
    tags: ['eléctrica', 'stratocaster', 'fender', 'rock', 'blues'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    _id: '2',
    sku: 'GIB-LP-STD-002',
    name: 'Gibson Les Paul Standard',
    brand: 'Gibson',
    category: 'guitarras',
    price: 2499.99,
    originalPrice: 2799.99,
    description: 'La legendaria Les Paul Standard con pastillas humbucker 490R y 498T, acabado en Bourbon Burst y hardware dorado.',
    features: [
      'Tapa de Arce Flameado AAA',
      'Cuerpo de Caoba',
      'Mástil de Caoba con Diapasón de Palisandro',
      'Pastillas 490R & 498T',
      'Hardware Dorado'
    ],
    specifications: {
      'Material del cuerpo': 'Caoba con tapa de arce',
      'Material del mástil': 'Caoba',
      'Diapasón': 'Palisandro',
      'Pastillas': 'Gibson 490R & 498T Humbucker',
      'Número de trastes': '22',
      'Escala': '24.75"',
      'Puente': 'Tune-o-Matic con Stopbar',
      'Hardware': 'Dorado'
    },
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500'
    ],
    stock: 8,
    rating: 4.9,
    reviews: 89,
    featured: true,
    tags: ['eléctrica', 'les paul', 'gibson', 'rock', 'metal'],
    createdAt: '2024-01-16T11:15:00Z',
    updatedAt: '2024-01-21T09:45:00Z'
  },
  {
    _id: '3',
    sku: 'YAM-FG800-003',
    name: 'Yamaha FG800',
    brand: 'Yamaha',
    category: 'guitarras',
    price: 199.99,
    originalPrice: 249.99,
    description: 'Guitarra acústica con tapa de abeto sólido y aros y fondo de nato. Excelente relación calidad-precio para principiantes y profesionales.',
    features: [
      'Tapa de Abeto Sólido',
      'Aros y Fondo de Nato',
      'Mástil de Nato',
      'Diapasón de Palisandro',
      'Sistema de Refuerzo en X'
    ],
    specifications: {
      'Tipo': 'Dreadnought',
      'Tapa': 'Abeto sólido',
      'Aros y fondo': 'Nato',
      'Material del mástil': 'Nato',
      'Diapasón': 'Palisandro',
      'Número de trastes': '20',
      'Escala': '25"',
      'Ancho de cejilla': '43mm'
    },
    images: [
      'https://images.unsplash.com/photo-1520166012956-add9ba0835cb?w=500',
      'https://images.unsplash.com/photo-1546984575-757f4f7c13cf?w=500'
    ],
    stock: 25,
    rating: 4.7,
    reviews: 203,
    featured: true,
    tags: ['acústica', 'yamaha', 'principiante', 'folk', 'fingerstyle'],
    createdAt: '2024-01-17T14:30:00Z',
    updatedAt: '2024-01-22T16:20:00Z'
  },
  {
    _id: '4',
    sku: 'FEN-JAZZ-BLK-004',
    name: 'Fender Player Jazz Bass',
    brand: 'Fender',
    category: 'bajos',
    price: 649.99,
    originalPrice: 729.99,
    description: 'Bajo eléctrico de 4 cuerdas con pastillas Player Series, mástil de arce y el sonido clásico del Jazz Bass.',
    features: [
      'Cuerpo de Aliso',
      'Mástil de Arce con Diapasón de Pau Ferro',
      'Pastillas Player Series Alnico 5',
      '20 Trastes Medium Jumbo',
      'Puente de 4 Monturas'
    ],
    specifications: {
      'Cuerdas': '4',
      'Escala': '34"',
      'Material del cuerpo': 'Aliso',
      'Material del mástil': 'Arce',
      'Diapasón': 'Pau Ferro',
      'Pastillas': 'Player Series Alnico 5 Single-Coil',
      'Controles': 'Volumen x2, Tono Master',
      'Puente': '4-Saddle Standard'
    },
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
      'https://images.unsplash.com/photo-1459305272254-33a7d593a851?w=500'
    ],
    stock: 12,
    rating: 4.6,
    reviews: 78,
    featured: false,
    tags: ['bajo', 'jazz bass', 'fender', 'funk', 'rock'],
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-23T11:30:00Z'
  },
  {
    _id: '5',
    sku: 'ROL-TD27-005',
    name: 'Roland TD-27KV V-Drums',
    brand: 'Roland',
    category: 'bateria',
    price: 1899.99,
    originalPrice: 2199.99,
    description: 'Batería electrónica profesional con módulo TD-27 y pads de malla para una experiencia de batería realista.',
    features: [
      'Módulo de Sonido TD-27',
      'Pads de Malla de 12" y 10"',
      'Hi-Hat VH-10 con Pedal',
      'Platos CY-12C x2 y CY-13R',
      'Bombo KD-10 con Pedal'
    ],
    specifications: {
      'Módulo': 'TD-27',
      'Configuración': '5 piezas',
      'Pads de caja': '12" malla',
      'Pads de tom': '10" malla x3',
      'Hi-hat': 'VH-10 con pedal',
      'Platos': 'CY-12C x2, CY-13R ride',
      'Bombo': 'KD-10 con pedal incluido',
      'Conexiones': 'USB, MIDI, Audio'
    },
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      'https://images.unsplash.com/photo-1519008435454-632945a4a204?w=500'
    ],
    stock: 5,
    rating: 4.8,
    reviews: 45,
    featured: true,
    tags: ['batería', 'electrónica', 'roland', 'profesional', 'estudio'],
    createdAt: '2024-01-19T13:45:00Z',
    updatedAt: '2024-01-24T10:15:00Z'
  },
  {
    _id: '6',
    sku: 'YAM-P45-006',
    name: 'Yamaha P-45',
    brand: 'Yamaha',
    category: 'teclados',
    price: 449.99,
    originalPrice: 499.99,
    description: 'Piano digital de 88 teclas con acción GHS (Graded Hammer Standard) y sonidos Advanced Wave Memory.',
    features: [
      '88 Teclas con Acción GHS',
      '10 Sonidos de Instrumentos',
      'Polifonía de 64 Notas',
      'Metronomo Integrado',
      'Dual Mode para Capas'
    ],
    specifications: {
      'Teclas': '88 (acción GHS)',
      'Polifonía': '64 notas',
      'Sonidos': '10',
      'Efectos': 'Reverb x4',
      'Conectividad': 'USB to Host, Pedal Sustain',
      'Altavoces': '12W x2',
      'Dimensiones': '132.6 x 29.5 x 15.4 cm',
      'Peso': '11.5 kg'
    },
    images: [
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500',
      'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=500'
    ],
    stock: 18,
    rating: 4.5,
    reviews: 156,
    featured: false,
    tags: ['piano', 'digital', 'yamaha', 'principiante', 'portátil'],
    createdAt: '2024-01-20T16:20:00Z',
    updatedAt: '2024-01-25T14:10:00Z'
  },
  {
    _id: '7',
    sku: 'SHU-SM58-007',
    name: 'Shure SM58',
    brand: 'Shure',
    category: 'microfonos',
    price: 99.99,
    originalPrice: 119.99,
    description: 'Micrófono dinámico cardioide legendario para voces. El estándar de la industria para actuaciones en vivo.',
    features: [
      'Patrón Polar Cardioide',
      'Respuesta de Frecuencia Optimizada para Voces',
      'Construcción Robusta de Metal',
      'Rejilla de Acero Resistente a Golpes',
      'Interruptor On/Off Integrado'
    ],
    specifications: {
      'Tipo': 'Dinámico',
      'Patrón polar': 'Cardioide',
      'Respuesta de frecuencia': '50 Hz - 15 kHz',
      'Impedancia': '150 Ω',
      'Sensibilidad': '-54.5 dBV/Pa',
      'Conectores': 'XLR macho de 3 pines',
      'Peso': '298 g',
      'Dimensiones': '162 x 51 mm'
    },
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500'
    ],
    stock: 30,
    rating: 4.9,
    reviews: 267,
    featured: true,
    tags: ['micrófono', 'vocal', 'shure', 'directo', 'profesional'],
    createdAt: '2024-01-21T08:30:00Z',
    updatedAt: '2024-01-26T12:45:00Z'
  },
  {
    _id: '8',
    sku: 'MAR-JCM800-008',
    name: 'Marshall JCM800 2203',
    brand: 'Marshall',
    category: 'amplificadores',
    price: 1299.99,
    originalPrice: 1499.99,
    description: 'Cabezal de guitarra de 100W todo válvulas. El sonido clásico del rock con la potencia y carácter Marshall.',
    features: [
      'Potencia: 100W RMS',
      'Válvulas: 3x ECC83, 4x EL34',
      'Canal Único con Boost',
      'EQ de 3 Bandas',
      'Salidas para 4, 8 y 16 Ohm'
    ],
    specifications: {
      'Potencia': '100W RMS',
      'Válvulas previo': '3x ECC83',
      'Válvulas potencia': '4x EL34',
      'Canales': '1 (con boost)',
      'Controles': 'Pre Amp, Bass, Middle, Treble, Presence, Master',
      'Impedancias': '4, 8, 16 Ohm',
      'Dimensiones': '74 x 26 x 22 cm',
      'Peso': '25 kg'
    },
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500'
    ],
    stock: 6,
    rating: 4.7,
    reviews: 92,
    featured: false,
    tags: ['amplificador', 'válvulas', 'marshall', 'rock', 'metal'],
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-27T15:20:00Z'
  }
]

export default mockProducts