import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  InputAdornment
} from '@mui/material'
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  MusicNote as MusicIcon,
  Send as SendIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material'
import toast from 'react-hot-toast'

const Footer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Suscripción al newsletter
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    if (!newsletterEmail.trim()) {
      toast.error('Por favor, introduce tu email')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newsletterEmail.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('¡Te has suscrito correctamente al newsletter! 🎵', {
          duration: 4000,
          icon: '📧'
        })
        setNewsletterEmail('')
      } else {
        toast.error(data.message || 'Error al suscribirse')
      }
    } catch (error) {
      console.error('Error en newsletter:', error)
      toast.error('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Enlaces de navegación
  const footerLinks = {
    tienda: [
      { label: 'Productos', path: '/productos' },
      { label: 'Ofertas', path: '/productos?oferta=true' },
      { label: 'Nuevos Productos', path: '/productos?nuevo=true' },
      { label: 'Más Vendidos', path: '/productos?popular=true' }
    ],
    servicios: [
      { label: 'Alquiler de Equipos', path: '/alquiler' },
      { label: 'Reparaciones', path: '/servicios/reparaciones' },
      { label: 'Instalaciones', path: '/servicios/instalaciones' },
      { label: 'Mantenimiento', path: '/servicios/mantenimiento' }
    ],
    empresa: [
      { label: 'Nosotros', path: '/nosotros' },
      { label: 'Orquesta Époka', path: '/orquesta-epoka' },
      { label: 'Nuestro Equipo', path: '/equipo' },
      { label: 'Blog Musical', path: '/blog' }
    ],
    soporte: [
      { label: 'Contacto', path: '/contacto' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Envíos y Devoluciones', path: '/envios-devoluciones' },
      { label: 'Garantías', path: '/garantias' }
    ]
  }

  // Redes sociales
  const socialLinks = [
    { 
      icon: FacebookIcon, 
      url: 'https://facebook.com/epkmusica',
      color: '#1877f2',
      label: 'Facebook'
    },
    { 
      icon: InstagramIcon, 
      url: 'https://instagram.com/epkmusica',
      color: '#e4405f',
      label: 'Instagram'
    },
    { 
      icon: YouTubeIcon, 
      url: 'https://youtube.com/epkmusica',
      color: '#ff0000',
      label: 'YouTube'
    },
    { 
      icon: TwitterIcon, 
      url: 'https://twitter.com/epkmusica',
      color: '#1da1f2',
      label: 'Twitter'
    },
    {
      icon: WhatsAppIcon,
      url: 'https://wa.me/34958123456',
      color: '#25d366',
      label: 'WhatsApp'
    }
  ]

  return (
    <Box 
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #171717 50%, #0f0f0f 100%)',
        borderTop: '1px solid rgba(88, 85, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Patrón de fondo musical */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: `
            radial-gradient(circle at 10% 20%, rgba(88, 85, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(255, 204, 0, 0.3) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Sección principal del footer */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Información de la empresa */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <MusicIcon 
                    sx={{ 
                      fontSize: 32, 
                      color: '#5855ff',
                      filter: 'drop-shadow(0 0 8px rgba(88, 85, 255, 0.5))'
                    }} 
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'Playfair Display',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #5855ff 0%, #ffcc00 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Epk Música
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  Tu tienda de confianza en Atarfe (Granada) para instrumentos musicales, 
                  equipos de sonido e iluminación. Conectados con la Orquesta Époka, 
                  llevamos la pasión por la música desde hace años.
                </Typography>

                {/* Información de contacto */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ color: '#5855ff', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Calle Principal 123, Atarfe, Granada
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: '#ffcc00', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      +34 958 123 456
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      info@epkmusica.com
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Redes sociales */}
              <Box sx={{ mt: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    mb: 2,
                    fontSize: '1.1rem'
                  }}
                >
                  Síguenos
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <IconButton
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: social.color,
                            transform: 'translateY(-3px) scale(1.1)',
                            background: `${social.color}20`
                          }
                        }}
                      >
                        <Icon />
                      </IconButton>
                    )
                  })}
                </Box>
              </Box>
            </Grid>

            {/* Enlaces de navegación */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <Grid item xs={6} sm={3} md={2} key={category}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '1.1rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {category === 'tienda' ? 'Tienda' : 
                   category === 'servicios' ? 'Servicios' :
                   category === 'empresa' ? 'Empresa' : 'Soporte'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {links.map((link, linkIndex) => (
                    <Typography
                      key={linkIndex}
                      component={Link}
                      to={link.path}
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#ffcc00',
                          paddingLeft: 1
                        }
                      }}
                    >
                      {link.label}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            ))}

            {/* Newsletter */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '1.1rem'
                }}
              >
                Newsletter Musical
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 3,
                  lineHeight: 1.5
                }}
              >
                Suscríbete para recibir las últimas noticias, ofertas exclusivas 
                y novedades del mundo musical.
              </Typography>
              
              <form onSubmit={handleNewsletterSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="tu@email.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(88, 85, 255, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5855ff'
                        }
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)'
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !newsletterEmail.trim()}
                    startIcon={loading ? null : <SendIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #5855ff, #ffcc00)',
                      color: 'white',
                      py: 1.2,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4c49f5, #e6b800)'
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)'
                      }
                    }}
                  >
                    {loading ? 'Suscribiendo...' : 'Suscribirse'}
                  </Button>
                </Box>
              </form>

              {/* Chips de beneficios */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
                <Chip
                  label="Ofertas exclusivas"
                  size="small"
                  sx={{
                    background: 'rgba(88, 85, 255, 0.2)',
                    color: '#5855ff',
                    borderColor: '#5855ff'
                  }}
                  variant="outlined"
                />
                <Chip
                  label="Nuevos productos"
                  size="small"
                  sx={{
                    background: 'rgba(255, 204, 0, 0.2)',
                    color: '#ffcc00',
                    borderColor: '#ffcc00'
                  }}
                  variant="outlined"
                />
                <Chip
                  label="Eventos musicales"
                  size="small"
                  sx={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#8b5cf6',
                    borderColor: '#8b5cf6'
                  }}
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Footer inferior */}
        <Box 
          sx={{ 
            py: 3,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            © {new Date().getFullYear()} Epk Música. Todos los derechos reservados. 
            Hecho con ❤️ para la música en Granada.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            <Typography
              component={Link}
              to="/privacidad"
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                '&:hover': {
                  color: '#ffcc00'
                }
              }}
            >
              Privacidad
            </Typography>
            <Typography
              component={Link}
              to="/terminos"
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                '&:hover': {
                  color: '#ffcc00'
                }
              }}
            >
              Términos
            </Typography>
            <Typography
              component={Link}
              to="/cookies"
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                '&:hover': {
                  color: '#ffcc00'
                }
              }}
            >
              Cookies
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer