// Tema personalizado para Epk Música
// Paleta de colores elegante y juvenil: Negro, Dorado, Azul/Violeta eléctrico

export const theme = {
  colors: {
    // Colores principales
    primary: {
      50: '#f0f0ff',
      100: '#e0e0ff',
      200: '#c7c7ff',
      300: '#a3a3ff',
      400: '#7a7aff',
      500: '#5855ff', // Azul-violeta principal
      600: '#4c49f5',
      700: '#3d3ae0',
      800: '#3230b8',
      900: '#2a2894',
    },
    
    // Dorado elegante
    gold: {
      50: '#fffef7',
      100: '#fffce8',
      200: '#fff7c2',
      300: '#ffed88',
      400: '#ffdd44',
      500: '#ffcc00', // Dorado principal
      600: '#e6b800',
      700: '#cc9900',
      800: '#b37700',
      900: '#995500',
    },
    
    // Escala de grises (negro a blanco)
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717', // Negro principal
    },
    
    // Colores de estado
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Colores específicos musicales
    musical: {
      neonBlue: '#00e5ff',
      electricPurple: '#8b5cf6',
      stageGold: '#ffd700',
      deepBlack: '#0a0a0a',
      rhythmRed: '#ff1744',
      bassBlue: '#1565c0',
    },
    
    // Backgrounds
    background: {
      primary: '#0a0a0a', // Fondo principal oscuro
      secondary: '#171717',
      card: '#262626',
      glass: 'rgba(255, 255, 255, 0.05)', // Efecto glass
      gradient: 'linear-gradient(135deg, #5855ff 0%, #8b5cf6 50%, #ffcc00 100%)',
      darkGradient: 'linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #262626 100%)',
    },
    
    // Texto
    text: {
      primary: '#ffffff',
      secondary: '#d4d4d4',
      muted: '#a3a3a3',
      accent: '#ffcc00',
      link: '#5855ff',
    }
  },
  
  // Tipografía
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Playfair Display', 'serif'],
      mono: ['Fira Code', 'monospace'],
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
    },
    
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  
  // Espaciado
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  
  // Bordes redondeados
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Sombras
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(88, 85, 255, 0.3)',
    goldGlow: '0 0 20px rgba(255, 204, 0, 0.3)',
    neon: '0 0 30px rgba(0, 229, 255, 0.5)',
  },
  
  // Animaciones
  animation: {
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
      slower: '750ms',
    },
    
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // Breakpoints responsivos
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '100',
    modal: '200',
    popover: '300',
    tooltip: '400',
    toast: '500',
  },
  
  // Configuraciones específicas de componentes
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '56px',
      },
      padding: {
        sm: '8px 16px',
        md: '12px 24px',
        lg: '16px 32px',
        xl: '20px 40px',
      }
    },
    
    input: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      }
    },
    
    card: {
      padding: {
        sm: '16px',
        md: '24px',
        lg: '32px',
      }
    }
  }
};

// Utilidades para crear estilos dinámicos
export const createGradient = (direction = '135deg', ...colors) => 
  `linear-gradient(${direction}, ${colors.join(', ')})`;

export const createGlow = (color, intensity = 0.3) => 
  `0 0 20px rgba(${color}, ${intensity})`;

export const createNeonText = (color = theme.colors.primary[500]) => ({
  color,
  textShadow: `0 0 10px ${color}`,
});

export const createGlassEffect = (opacity = 0.1) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

// Componentes styled-components reutilizables
export const musicTheme = {
  // Efectos visuales musicales
  pulseAnimation: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  
  waveAnimation: `
    @keyframes wave {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `,
  
  glowAnimation: `
    @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(88, 85, 255, 0.2); }
      50% { box-shadow: 0 0 20px rgba(88, 85, 255, 0.8); }
      100% { box-shadow: 0 0 5px rgba(88, 85, 255, 0.2); }
    }
  `,
  
  // Patrones musicales
  notePattern: `
    background-image: radial-gradient(circle, rgba(255, 204, 0, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  `,
  
  rhythmPattern: `
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(88, 85, 255, 0.1) 25%, 
      transparent 50%, 
      rgba(255, 204, 0, 0.1) 75%, 
      transparent 100%
    );
  `,
};

export default theme;