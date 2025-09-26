import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Home as HomeIcon,
  Search as SearchIcon,
  MusicNote as MusicIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material'

const NotFound = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Fondo musical animado */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 30%, rgba(88, 85, 255, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 204, 0, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
          `,
          animation: 'float-notes 6s ease-in-out infinite'
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Ícono musical grande */}
            <Box sx={{ mb: 4, position: 'relative' }}>
              <MusicIcon
                sx={{
                  fontSize: { xs: 120, md: 180 },
                  color: '#5855ff',
                  filter: 'drop-shadow(0 0 30px rgba(88, 85, 255, 0.5))',
                  animation: 'pulse-music 2s ease-in-out infinite'
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '6rem', md: '8rem' },
                  fontWeight: 800,
                  fontFamily: 'Playfair Display',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'linear-gradient(135deg, #5855ff 0%, #ffcc00 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  opacity: 0.8
                }}
              >
                404
              </Typography>
            </Box>

            {/* Mensaje principal */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                fontFamily: 'Playfair Display',
                color: 'white',
                mb: 2
              }}
            >
              ¡Ups! Esta nota no existe
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 1,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              La página que buscas se ha perdido en el compás
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 6,
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              No te preocupes, en Epk Música siempre encontramos la armonía perfecta. 
              Te ayudamos a volver al ritmo correcto.
            </Typography>

            {/* Botones de acción */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center'
              }}
            >
              <Button
                component={Link}
                to="/"
                size="large"
                startIcon={<HomeIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #5855ff, #8b5cf6)',
                  color: 'white',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: '0 10px 30px rgba(88, 85, 255, 0.4)'
                  }
                }}
              >
                Volver al Inicio
              </Button>

              <Button
                component={Link}
                to="/productos"
                size="large"
                startIcon={<SearchIcon />}
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#ffcc00',
                  borderColor: '#ffcc00',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 204, 0, 0.1)',
                    borderColor: '#ffcc00',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Explorar Productos
              </Button>

              <Button
                onClick={() => window.history.back()}
                size="large"
                startIcon={<BackIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    color: 'white'
                  }
                }}
              >
                Volver Atrás
              </Button>
            </Box>

            {/* Sugerencias populares */}
            <Box sx={{ mt: 8 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 3,
                  fontWeight: 600
                }}
              >
                ¿Quizás estabas buscando?
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                {[
                  { label: 'Guitarras', path: '/productos?categoria=guitarras' },
                  { label: 'Equipos de Sonido', path: '/productos?categoria=sonido' },
                  { label: 'Alquiler', path: '/alquiler' },
                  { label: 'Ofertas', path: '/productos?oferta=true' },
                  { label: 'Contacto', path: '/contacto' }
                ].map((item, index) => (
                  <Button
                    key={index}
                    component={Link}
                    to={item.path}
                    variant="text"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#ffcc00',
                        background: 'rgba(255, 204, 0, 0.1)'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}

export default NotFound