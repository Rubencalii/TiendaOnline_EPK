import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Rating,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import productService from '../services/productService'

const Products = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()

  // Estados
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  
  // Filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 3000,
    sortBy: searchParams.get('sortBy') || 'name'
  })

  // Paginación
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const productsPerPage = 12

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [filters, page])

  useEffect(() => {
    // Actualizar URL con filtros actuales
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value.toString())
      }
    })
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [filters, page, setSearchParams])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const options = {
        category: filters.category !== 'all' ? filters.category : null,
        search: filters.search || null,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice
      }

      const result = await productService.getAllProducts(options)
      
      if (result.success) {
        let sortedProducts = [...result.data]
        
        // Aplicar ordenamiento
        switch (filters.sortBy) {
          case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price)
            break
          case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price)
            break
          case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating)
            break
          case 'reviews':
            sortedProducts.sort((a, b) => b.reviews - a.reviews)
            break
          default: // name
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        }

        // Aplicar paginación
        const startIndex = (page - 1) * productsPerPage
        const endIndex = startIndex + productsPerPage
        const paginatedProducts = sortedProducts.slice(startIndex, endIndex)
        
        setProducts(paginatedProducts)
        setTotalPages(Math.ceil(sortedProducts.length / productsPerPage))
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error('Error cargando productos:', err)
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const result = await productService.getCategories()
      if (result.success) {
        setCategories(result.data)
      }
    } catch (err) {
      console.error('Error cargando categorías:', err)
    }
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
    setPage(1) // Reset página al cambiar filtros
  }

  const handleFavoriteToggle = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      quantity: 1
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #1a1a1a 100%)`,
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              mb: 2,
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Nuestros Productos
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              mb: 4
            }}
          >
            Descubre nuestra amplia selección de instrumentos y equipos musicales
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar de filtros */}
          <Grid item xs={12} md={3}>
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Filtros
              </Typography>

              {/* Búsqueda */}
              <TextField
                fullWidth
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />
                }}
              />

              {/* Categoría */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Categoría
                </InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <MenuItem value="all">Todas las categorías</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.name} value={category.name}>
                      {category.label} ({category.count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Rango de precios */}
              <Typography sx={{ color: 'white', mb: 2 }}>
                Rango de precio: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
              </Typography>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={(e, newValue) => {
                  handleFilterChange('minPrice', newValue[0])
                  handleFilterChange('maxPrice', newValue[1])
                }}
                min={0}
                max={3000}
                step={50}
                sx={{
                  color: theme.palette.secondary.main,
                  mb: 3
                }}
              />

              {/* Ordenamiento */}
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Ordenar por
                </InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <MenuItem value="name">Nombre A-Z</MenuItem>
                  <MenuItem value="price-low">Precio: Menor a Mayor</MenuItem>
                  <MenuItem value="price-high">Precio: Mayor a Menor</MenuItem>
                  <MenuItem value="rating">Mejor Valorados</MenuItem>
                  <MenuItem value="reviews">Más Reseñas</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Lista de productos */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: theme.palette.secondary.main }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : products.length === 0 ? (
              <Paper 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  No se encontraron productos
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Intenta ajustar los filtros de búsqueda
                </Typography>
              </Paper>
            ) : (
              <>
                {/* Información de resultados */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Mostrando {products.length} productos
                  </Typography>
                </Box>

                {/* Grid de productos */}
                <Grid container spacing={3}>
                  {products.map((product) => (
                    <Grid item xs={12} sm={6} lg={4} key={product._id}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: `0 10px 30px rgba(${theme.palette.secondary.main.slice(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.3)`
                          },
                          display: 'flex',
                          flexDirection: 'column'
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
                              borderRadius: '8px 8px 0 0'
                            }}
                          />
                          
                          {/* Badge de descuento */}
                          {product.originalPrice && calculateDiscount(product.price, product.originalPrice) > 0 && (
                            <Chip
                              label={`-${calculateDiscount(product.price, product.originalPrice)}%`}
                              sx={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                bgcolor: theme.palette.error.main,
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          )}

                          {/* Badge de destacado */}
                          {product.featured && (
                            <Chip
                              label="Destacado"
                              sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                bgcolor: theme.palette.secondary.main,
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          )}

                          {/* Botón de favorito */}
                          <IconButton
                            sx={{
                              position: 'absolute',
                              bottom: 10,
                              right: 10,
                              bgcolor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)'
                              }
                            }}
                            onClick={() => handleFavoriteToggle(product._id)}
                          >
                            {favorites.has(product._id) ? 
                              <FavoriteIcon sx={{ color: theme.palette.error.main }} /> : 
                              <FavoriteBorderIcon />
                            }
                          </IconButton>
                        </Box>

                        <CardContent sx={{ flexGrow: 1, color: 'white' }}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {product.name}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ color: theme.palette.secondary.main, mb: 1 }}>
                            {product.brand}
                          </Typography>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)', 
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {product.description}
                          </Typography>

                          {/* Rating */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating 
                              value={product.rating} 
                              precision={0.1} 
                              readOnly 
                              size="small"
                              sx={{ color: theme.palette.secondary.main }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)', 
                                ml: 1 
                              }}
                            >
                              ({product.reviews} reseñas)
                            </Typography>
                          </Box>

                          {/* Precio */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: theme.palette.secondary.main, 
                                fontWeight: 'bold' 
                              }}
                            >
                              {formatPrice(product.price)}
                            </Typography>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.5)', 
                                  textDecoration: 'line-through',
                                  ml: 1 
                                }}
                              >
                                {formatPrice(product.originalPrice)}
                              </Typography>
                            )}
                          </Box>

                          {/* Stock */}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: product.stock > 0 ? theme.palette.success.main : theme.palette.error.main,
                              mb: 2
                            }}
                          >
                            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                          </Typography>
                        </CardContent>

                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CartIcon />}
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            sx={{
                              bgcolor: theme.palette.secondary.main,
                              '&:hover': {
                                bgcolor: theme.palette.secondary.dark
                              },
                              '&:disabled': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.3)'
                              }
                            }}
                          >
                            {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Paginación */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(e, newPage) => setPage(newPage)}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        },
                        '& .Mui-selected': {
                          bgcolor: `${theme.palette.secondary.main} !important`,
                          color: 'white'
                        }
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Products