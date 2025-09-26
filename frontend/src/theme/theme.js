import { createTheme } from '@mui/material/styles'

// Configuración del tema musical para Epk Música
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5855ff', // Azul-violeta vibrante
      light: '#8b5cf6',
      dark: '#4c49f5',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ffcc00', // Dorado musical
      light: '#ffd633',
      dark: '#e6b800',
      contrastText: '#000000'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    info: {
      main: '#00e5ff', // Azul neón
      light: '#40e9ff',
      dark: '#00bcd4'
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669'
    },
    background: {
      default: '#0a0a0a', // Negro profundo
      paper: 'rgba(255, 255, 255, 0.05)' // Superficie con transparencia
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.3)'
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    // Colores personalizados para el tema musical
    custom: {
      gold: '#ffcc00',
      neon: '#00e5ff',
      purple: '#8b5cf6',
      gradient: {
        primary: 'linear-gradient(135deg, #5855ff 0%, #8b5cf6 100%)',
        secondary: 'linear-gradient(135deg, #ffcc00 0%, #ff9500 100%)',
        stage: 'linear-gradient(135deg, #5855ff 0%, #8b5cf6 50%, #ffcc00 100%)'
      }
    }
  },
  
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    
    // Títulos elegantes con Playfair Display
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '2.5rem'
      }
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '2rem'
      }
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.75rem'
      }
    },
    h4: {
      fontFamily: 'Inter',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.5rem'
      }
    },
    h5: {
      fontFamily: 'Inter',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4
    },
    h6: {
      fontFamily: 'Inter',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4
    },
    
    // Texto del cuerpo
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: 'rgba(255, 255, 255, 0.8)'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: 'rgba(255, 255, 255, 0.7)'
    },
    
    // Botones y etiquetas
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '0.02em'
    },
    caption: {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.6)'
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  },
  
  // Breakpoints responsive
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  
  // Espaciado
  spacing: 8, // 8px base
  
  // Configuración de formas
  shape: {
    borderRadius: 12 // Bordes más suaves
  },
  
  // Sombras personalizadas
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.12)',
    '0 1px 6px rgba(0, 0, 0, 0.16)',
    '0 3px 6px rgba(0, 0, 0, 0.16)',
    '0 5px 12px rgba(0, 0, 0, 0.20)',
    '0 10px 24px rgba(0, 0, 0, 0.25)',
    '0 15px 35px rgba(88, 85, 255, 0.15)',
    '0 20px 40px rgba(88, 85, 255, 0.20)',
    '0 25px 50px rgba(255, 204, 0, 0.15)',
    ...Array(15).fill('0 25px 50px rgba(0, 0, 0, 0.3)')
  ],
  
  // Z-index personalizado
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  },
  
  // Componentes personalizados
  components: {
    // AppBar personalizado
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none'
        }
      }
    },
    
    // Botones personalizados
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          }
        },
        contained: {
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          }
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2
          }
        }
      }
    },
    
    // Cards personalizadas
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(88, 85, 255, 0.15)'
          }
        }
      }
    },
    
    // Inputs personalizados
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 2
            },
            '&:hover fieldset': {
              borderColor: 'rgba(88, 85, 255, 0.5)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5855ff'
            }
          }
        }
      }
    },
    
    // Chips personalizados
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.8rem'
        }
      }
    },
    
    // Tooltip personalizado
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          fontSize: '0.875rem'
        }
      }
    },
    
    // Drawer personalizado
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    },
    
    // Menu personalizado
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          marginTop: 8
        }
      }
    },
    
    // Lista personalizada
    MuiList: {
      styleOverrides: {
        root: {
          padding: 8
        }
      }
    },
    
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          '&:hover': {
            backgroundColor: 'rgba(88, 85, 255, 0.1)'
          }
        }
      }
    },
    
    // Typography personalizada
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.gradient-text': {
            background: 'linear-gradient(135deg, #5855ff 0%, #ffcc00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          },
          '&.glow-text': {
            textShadow: '0 0 10px currentColor'
          }
        }
      }
    },
    
    // ScrollBar personalizado (para navegadores webkit)
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': {
            width: 8
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#171717'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #5855ff, #ffcc00)',
            borderRadius: 4
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(180deg, #4c49f5, #e6b800)'
          }
        }
      }
    }
  }
})