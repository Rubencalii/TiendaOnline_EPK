import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  Rating
} from '@mui/material'
import {
  PlayArrow as PlayIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  LocalOffer as OfferIcon,
  Verified as VerifiedIcon,
  MusicNote as MusicIcon,
  GraphicEq as AudioIcon,
  Lightbulb as LightIcon
} from '@mui/icons-material'
import { useCart } from '../context/CartContext'

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)

  // Hero slides con contenido musical
  const heroSlides = [
    {
      title: "Tu Sonido, Nuestra Pasión",
      subtitle: "Descubre la mejor selección de instrumentos musicales en Granada",
      image: "/api/placeholder/1200/600",
      cta: "Ver Productos",
      link: "/productos",
      accent: "#5855ff"
    },
    {
      title: "Equipos de Sonido Profesional",
      subtitle: "Ilumina tu evento con nuestra tecnología de vanguardia",
      image: "/api/placeholder/1200/600",
      cta: "Alquilar Equipos",
      link: "/alquiler",
      accent: "#ffcc00"
    },
    {
      title: "Orquesta Époka",
      subtitle: "La experiencia musical que conecta corazones en cada evento",
      image: "/api/placeholder/1200/600",
      cta: "Conoce Más",
      link: "/nosotros",
      accent: "#8b5cf6"
    }
  ]

  // Cambio automático de slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Cargar productos destacados
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products?featured=true&limit=6`)
        if (response.ok) {
          const data = await response.json()
          setFeaturedProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error cargando productos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Categorías principales
  const mainCategories = [
    {
      title: "Instrumentos",
      description: "Guitarras, bajos, baterías y más",
      icon: MusicIcon,
      image: "/api/placeholder/400/300",
      link: "/productos?categoria=instrumentos",
      color: "#5855ff"
    },
    {
      title: "Sonido",
      description: "Equipos profesionales de audio",
      icon: AudioIcon,
      image: "/api/placeholder/400/300",
      link: "/productos?categoria=sonido",
      color: "#ffcc00"
    },
    {
      title: "Iluminación",
      description: "Luces para eventos y espectáculos",
      icon: LightIcon,
      image: "/api/placeholder/400/300",
      link: "/productos?categoria=iluminacion",
      color: "#8b5cf6"
    }
  ]

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section con Slider */}
      <Box sx={{ position: 'relative', height: '80vh', minHeight: 500 }}>
        {heroSlides.map((slide, index) => (
          <Fade
            key={index}
            in={currentHeroSlide === index}
            timeout={1000}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, rgba(10, 10, 10, 0.7) 0%, rgba(${slide.accent === '#5855ff' ? '88, 85, 255' : slide.accent === '#ffcc00' ? '255, 204, 0' : '139, 92, 246'}, 0.3) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                  <Slide direction="up" in={currentHeroSlide === index} timeout={800}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        fontWeight: 800,
                        fontFamily: 'Playfair Display',
                        mb: 2,
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
                        background: `linear-gradient(135deg, white 0%, ${slide.accent} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {slide.title}
                    </Typography>
                  </Slide>
                  
                  <Slide direction="up" in={currentHeroSlide === index} timeout={1000}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                        mb: 4,
                        opacity: 0.9,
                        maxWidth: 600,
                        mx: 'auto'
                      }}
                    >
                      {slide.subtitle}
                    </Typography>
                  </Slide>
                  
                  <Slide direction="up" in={currentHeroSlide === index} timeout={1200}>
                    <Button
                      component={Link}
                      to={slide.link}
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${slide.accent} 0%, rgba(255, 255, 255, 0.2) 100%)`,
                        color: 'white',
                        border: `2px solid ${slide.accent}`,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.05)',
                          boxShadow: `0 10px 30px rgba(${slide.accent === '#5855ff' ? '88, 85, 255' : slide.accent === '#ffcc00' ? '255, 204, 0' : '139, 92, 246'}, 0.4)`
                        }
                      }}
                    >
                      {slide.cta}
                    </Button>
                  </Slide>
                </Box>
              </Container>

              {/* Indicadores de slides */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: 30, 
                left: '50%', 
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1
              }}>
                {heroSlides.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentHeroSlide(index)}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: currentHeroSlide === index ? slide.accent : 'rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Fade>
        ))}
        
        {/* Patrón musical de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `
              radial-gradient(circle at 20% 30%, rgba(88, 85, 255, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 204, 0, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
            `,
            pointerEvents: 'none'
          }}
        />
      </Box>

      {/* Categorías Principales */}
      <Box sx={{ py: 8, background: 'rgba(255, 255, 255, 0.02)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                fontFamily: 'Playfair Display',
                mb: 2,
                background: 'linear-gradient(135deg, #5855ff 0%, #ffcc00 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Nuestras Categorías
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, mx: 'auto' }}>
              Explora nuestra amplia gama de productos musicales y de entretenimiento
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {mainCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Fade in timeout={800 + index * 200}>
                    <Card
                      component={Link}
                      to={category.link}
                      sx={{
                        height: 350,
                        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.4s ease',
                        textDecoration: 'none',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.02)',
                          boxShadow: `0 20px 60px rgba(${category.color === '#5855ff' ? '88, 85, 255' : category.color === '#ffcc00' ? '255, 204, 0' : '139, 92, 246'}, 0.3)`,
                          borderColor: `${category.color}40`
                        }
                      }}
                    >
                      <Box sx={{ 
                        height: 200, 
                        background: `linear-gradient(135deg, ${category.color}40 0%, transparent 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <Icon sx={{ 
                          fontSize: 80, 
                          color: category.color,
                          filter: `drop-shadow(0 0 20px ${category.color}50)`
                        }} />
                      </Box>
                      
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: 'white',
                            mb: 1,
                            fontFamily: 'Playfair Display'
                          }}
                        >
                          {category.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {category.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      {/* Productos Destacados */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                fontFamily: 'Playfair Display',
                mb: 2,
                background: 'linear-gradient(135deg, #ffcc00 0%, #5855ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Productos Destacados
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, mx: 'auto' }}>
              Los favoritos de nuestros clientes y las mejores ofertas del momento
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <div className="loading-music">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {featuredProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Fade in timeout={1000 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(88, 85, 255, 0.2)',
                          borderColor: 'rgba(255, 204, 0, 0.3)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.images?.[0] || '/api/placeholder/300/200'}
                          alt={product.name}
                          sx={{
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        
                        {/* Badges */}
                        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {product.featured && (
                            <Chip
                              icon={<StarIcon />}
                              label="Destacado"
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #ffcc00, #ff9500)',
                                color: 'black',
                                fontWeight: 600
                              }}
                            />
                          )}
                          {product.salePrice && (
                            <Chip
                              icon={<OfferIcon />}
                              label="Oferta"
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>

                        {/* Botón favorito */}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                              background: 'rgba(239, 68, 68, 0.8)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      </Box>

                      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: 'white',
                            mb: 1,
                            fontSize: '1rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {product.name}
                        </Typography>

                        {/* Rating */}
                        {product.averageRating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating
                              value={product.averageRating}
                              readOnly
                              size="small"
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#ffcc00'
                                }
                              }}
                            />
                            <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                              ({product.reviewCount})
                            </Typography>
                          </Box>
                        )}

                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 2,
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {product.description}
                        </Typography>

                        {/* Precio */}
                        <Box sx={{ mb: 2 }}>
                          {product.salePrice ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: '#ffcc00'
                                }}
                              >
                                €{product.salePrice}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  textDecoration: 'line-through',
                                  color: 'rgba(255, 255, 255, 0.5)'
                                }}
                              >
                                €{product.price}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: '#ffcc00'
                              }}
                            >
                              €{product.price}
                            </Typography>
                          )}
                        </Box>

                        {/* Botones de acción */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            component={Link}
                            to={`/productos/${product._id}`}
                            sx={{
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white',
                              '&:hover': {
                                borderColor: '#5855ff',
                                background: 'rgba(88, 85, 255, 0.1)'
                              }
                            }}
                          >
                            Ver Detalles
                          </Button>
                          <Button
                            onClick={() => addToCart(product, 1)}
                            disabled={product.stock === 0}
                            sx={{
                              minWidth: 48,
                              background: product.stock > 0 
                                ? 'linear-gradient(135deg, #5855ff, #8b5cf6)' 
                                : 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              '&:hover': {
                                background: product.stock > 0 
                                  ? 'linear-gradient(135deg, #4c49f5, #7c3aed)'
                                  : 'rgba(255, 255, 255, 0.1)'
                              },
                              '&:disabled': {
                                color: 'rgba(255, 255, 255, 0.3)'
                              }
                            }}
                          >
                            <CartIcon />
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/productos"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #5855ff, #ffcc00)',
                color: 'white',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 30px rgba(88, 85, 255, 0.4)'
                }
              }}
            >
              Ver Todos los Productos
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Final */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, rgba(88, 85, 255, 0.1) 0%, rgba(255, 204, 0, 0.1) 100%)',
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 700,
                fontFamily: 'Playfair Display',
                mb: 2,
                color: 'white'
              }}
            >
              ¿Listo para hacer música?
            </Typography>
            <Typography
              variant="h6"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Únete a nuestra comunidad musical y descubre todo lo que tenemos para ofrecerte
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/contacto"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#ffcc00',
                    background: 'rgba(255, 204, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Contáctanos
              </Button>
              <Button
                component={Link}
                to="/nosotros"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #ffcc00, #ff9500)',
                  color: 'black',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e6b800, #e6850e)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Nuestra Historia
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Home