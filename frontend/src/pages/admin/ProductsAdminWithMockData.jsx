import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
  Button,
  Avatar
} from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Inventory as StockIcon,
  Star as FeaturedIcon,
  TrendingUp as TrendingIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import productService from '../../services/productService'

const ProductsAdminWithMockData = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [detailDialog, setDetailDialog] = useState(false)
  const [stats, setStats] = useState(null)

  // Datos mock de instrumentos reales
  const mockProducts = [
    {
      _id: 'product_1',
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
        pickups: '3 pastillas single-coil Player Series Alnico V'
      },
      stock: 15,
      images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'],
      rating: 4.7,
      reviews: 89,
      inStock: true,
      featured: true,
      status: 'active',
      sku: 'EPK-0001',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: 'product_2',
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
        pickups: '2 Humbuckers 490R y 498T'
      },
      stock: 8,
      images: ['https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=400'],
      rating: 4.9,
      reviews: 156,
      inStock: true,
      featured: true,
      status: 'active',
      sku: 'EPK-0002',
      createdAt: '2024-01-20T14:30:00Z'
    },
    {
      _id: 'product_3',
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
        sides: 'Rosewood'
      },
      stock: 25,
      images: ['https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400'],
      rating: 4.6,
      reviews: 234,
      inStock: true,
      featured: false,
      status: 'active',
      sku: 'EPK-0003',
      createdAt: '2024-02-05T09:15:00Z'
    },
    {
      _id: 'product_4',
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
        scale: '34" (864 mm)'
      },
      stock: 12,
      images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'],
      rating: 4.8,
      reviews: 67,
      inStock: true,
      featured: false,
      status: 'active',
      sku: 'EPK-0004',
      createdAt: '2024-02-10T16:20:00Z'
    },
    {
      _id: 'product_5',
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
        connectivity: 'USB to Host, Sustain Pedal, Phones'
      },
      stock: 18,
      images: ['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400'],
      rating: 4.7,
      reviews: 92,
      inStock: true,
      featured: true,
      status: 'active',
      sku: 'EPK-0005',
      createdAt: '2024-02-15T11:45:00Z'
    },
    {
      _id: 'product_6',
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
        connector: 'XLR'
      },
      stock: 30,
      images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400'],
      rating: 4.9,
      reviews: 312,
      inStock: true,
      featured: true,
      status: 'active',
      sku: 'EPK-0006',
      createdAt: '2024-02-20T13:10:00Z'
    },
    {
      _id: 'product_7',
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
        hardware: 'Cromado'
      },
      stock: 6,
      images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
      rating: 4.5,
      reviews: 43,
      inStock: true,
      featured: false,
      status: 'active',
      sku: 'EPK-0007',
      createdAt: '2024-02-25T15:30:00Z'
    },
    {
      _id: 'product_8',
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
        effects: 'Reverb de resorte'
      },
      stock: 10,
      images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'],
      rating: 4.6,
      reviews: 78,
      inStock: true,
      featured: false,
      status: 'active',
      sku: 'EPK-0008',
      createdAt: '2024-03-01T08:20:00Z'
    }
  ]

  const categories = [
    { value: 'guitarras', label: 'Guitarras' },
    { value: 'bajos', label: 'Bajos' },
    { value: 'bateria', label: 'Batería' },
    { value: 'teclados', label: 'Teclados' },
    { value: 'microfonos', label: 'Micrófonos' },
    { value: 'amplificadores', label: 'Amplificadores' }
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, categoryFilter, statusFilter, stockFilter])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const result = await productService.getAllProducts()
      if (result.success) {
        setProducts(result.data)
        calculateStats(result.data)
        toast.success(`${result.data.length} productos cargados`)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error cargando productos:', error)
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (productList) => {
    const totalProducts = productList.length
    const totalValue = productList.reduce((sum, p) => sum + (p.price * p.stock), 0)
    const inStock = productList.filter(p => p.inStock).length
    const featured = productList.filter(p => p.featured).length
    const lowStock = productList.filter(p => p.stock < 10).length

    setStats({
      totalProducts,
      totalValue,
      inStock,
      featured,
      lowStock,
      categories: categories.map(cat => ({
        name: cat.label,
        count: productList.filter(p => p.category === cat.value).length
      }))
    })
  }

  const filterProducts = () => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter)
    }

    if (stockFilter !== 'all') {
      if (stockFilter === 'inStock') {
        filtered = filtered.filter(product => product.inStock && product.stock > 0)
      } else if (stockFilter === 'outOfStock') {
        filtered = filtered.filter(product => !product.inStock || product.stock === 0)
      } else if (stockFilter === 'lowStock') {
        filtered = filtered.filter(product => product.stock < 10 && product.stock > 0)
      }
    }

    setFilteredProducts(filtered)
  }

  const handleActionMenuOpen = (event, product) => {
    event.stopPropagation()
    setActionMenuAnchor(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setSelectedProduct(null)
  }

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    
    setProducts(prev =>
      prev.map(p =>
        p._id === product._id
          ? { ...p, status: newStatus }
          : p
      )
    )
    
    toast.success(`Producto ${newStatus === 'active' ? 'activado' : 'desactivado'} correctamente`)
    handleActionMenuClose()
  }

  const handleToggleFeatured = async (product) => {
    setProducts(prev =>
      prev.map(p =>
        p._id === product._id
          ? { ...p, featured: !p.featured }
          : p
      )
    )
    
    toast.success(`Producto ${!product.featured ? 'marcado como' : 'removido de'} destacado`)
    handleActionMenuClose()
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStockColor = (product) => {
    if (!product.inStock || product.stock === 0) return '#ef4444'
    if (product.stock < 10) return '#f59e0b'
    return '#10b981'
  }

  const getStockLabel = (product) => {
    if (!product.inStock || product.stock === 0) return 'Sin stock'
    if (product.stock < 10) return 'Stock bajo'
    return 'En stock'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="loading-music">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Playfair Display',
                fontWeight: 700,
                color: 'white',
                mb: 1
              }}
            >
              Catálogo de Instrumentos
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {filteredProducts.length} de {products.length} productos
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #059669, #047857)'
              }
            }}
            onClick={() => toast.info('Funcionalidad de agregar producto en desarrollo')}
          >
            Nuevo Producto
          </Button>
        </Box>

        {/* Estadísticas */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: 3
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                        Total Productos
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                        {stats.totalProducts}
                      </Typography>
                    </Box>
                    <StockIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #5855ff, #4c49f5)',
                  border: 'none',
                  borderRadius: 3
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                        Valor Total
                      </Typography>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                        {formatCurrency(stats.totalValue)}
                      </Typography>
                    </Box>
                    <TrendingIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #ffcc00, #f59e0b)',
                  border: 'none',
                  borderRadius: 3
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.875rem' }}>
                        Destacados
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'black', fontWeight: 700 }}>
                        {stats.featured}
                      </Typography>
                    </Box>
                    <FeaturedIcon sx={{ fontSize: 40, color: 'rgba(0, 0, 0, 0.7)' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  border: 'none',
                  borderRadius: 3
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                        En Stock
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                        {stats.inStock}
                      </Typography>
                    </Box>
                    <ActiveIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: 3
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                        Stock Bajo
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                        {stats.lowStock}
                      </Typography>
                    </Box>
                    <InactiveIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filtros */}
        <Card
          sx={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
            mb: 3
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2.5}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Categoría</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Categoría"
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="all">Todas las categorías</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.5}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Stock</InputLabel>
                  <Select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    label="Stock"
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="all">Todo el stock</MenuItem>
                    <MenuItem value="inStock">En stock</MenuItem>
                    <MenuItem value="lowStock">Stock bajo</MenuItem>
                    <MenuItem value="outOfStock">Sin stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Estado"
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="active">Activos</MenuItem>
                    <MenuItem value="inactive">Inactivos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('')
                    setCategoryFilter('all')
                    setStockFilter('all')
                    setStatusFilter('all')
                  }}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white'
                  }}
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabla de productos */}
        <Card
          sx={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Producto
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Categoría
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Precio
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Valoración
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow
                      key={product._id}
                      sx={{
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.02)',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => {
                        setSelectedProduct(product)
                        setDetailDialog(true)
                      }}
                    >
                      <TableCell sx={{ border: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={product.images?.[0]}
                            sx={{
                              width: 50,
                              height: 50,
                              background: 'linear-gradient(135deg, #5855ff, #ffcc00)'
                            }}
                          >
                            {product.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              SKU: {product.sku} • {product.brand}
                            </Typography>
                            {product.featured && (
                              <Chip
                                label="Destacado"
                                size="small"
                                icon={<FeaturedIcon sx={{ fontSize: 14 }} />}
                                sx={{
                                  ml: 1,
                                  background: '#ffcc0020',
                                  color: '#ffcc00',
                                  fontSize: '0.75rem'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {categories.find(c => c.value === product.category)?.label || product.category}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Typography variant="body1" sx={{ color: '#ffcc00', fontWeight: 600 }}>
                          {formatCurrency(product.price)}
                        </Typography>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              textDecoration: 'line-through'
                            }}
                          >
                            {formatCurrency(product.originalPrice)}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: getStockColor(product)
                            }}
                          />
                          <Typography
                            sx={{
                              color: getStockColor(product),
                              fontWeight: 600
                            }}
                          >
                            {product.stock} unidades
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {getStockLabel(product)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Chip
                          label={product.status === 'active' ? 'Activo' : 'Inactivo'}
                          size="small"
                          sx={{
                            background: product.status === 'active' ? '#10b98120' : '#6b728020',
                            color: product.status === 'active' ? '#10b981' : '#6b7280',
                            border: `1px solid ${product.status === 'active' ? '#10b98140' : '#6b728040'}`,
                            fontWeight: 600
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                          </Box>
                          <Typography variant="body2" sx={{ color: '#ffcc00', fontWeight: 600 }}>
                            {product.rating}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {product.reviews} reseñas
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <IconButton
                          onClick={(e) => handleActionMenuOpen(e, product)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              background: 'rgba(88, 85, 255, 0.1)',
                              color: '#5855ff'
                            }
                          }}
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: 'white',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
        </Card>

        {/* Menu de acciones */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
          sx={{
            '& .MuiPaper-root': {
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2
            }
          }}
        >
          <MenuItem
            onClick={() => {
              setDetailDialog(true)
              handleActionMenuClose()
            }}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
          >
            <ViewIcon sx={{ mr: 1 }} />
            Ver Detalles
          </MenuItem>
          <MenuItem
            onClick={() => {
              toast.info('Funcionalidad de editar en desarrollo')
              handleActionMenuClose()
            }}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => handleToggleFeatured(selectedProduct)}
            sx={{ color: '#ffcc00', '&:hover': { bgcolor: 'rgba(255, 204, 0, 0.1)' } }}
          >
            <FeaturedIcon sx={{ mr: 1 }} />
            {selectedProduct?.featured ? 'Quitar destacado' : 'Marcar destacado'}
          </MenuItem>
          <MenuItem
            onClick={() => handleToggleStatus(selectedProduct)}
            sx={{ 
              color: selectedProduct?.status === 'active' ? '#ef4444' : '#10b981',
              '&:hover': { 
                bgcolor: selectedProduct?.status === 'active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'
              }
            }}
          >
            {selectedProduct?.status === 'active' ? (
              <>
                <InactiveIcon sx={{ mr: 1 }} />
                Desactivar
              </>
            ) : (
              <>
                <ActiveIcon sx={{ mr: 1 }} />
                Activar
              </>
            )}
          </MenuItem>
          <MenuItem
            onClick={() => {
              toast.info('Funcionalidad de eliminar en desarrollo')
              handleActionMenuClose()
            }}
            sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog de detalles */}
        <Dialog
          open={detailDialog}
          onClose={() => setDetailDialog(false)}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiPaper-root': {
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3
            }
          }}
        >
          {selectedProduct && (
            <>
              <DialogTitle sx={{ color: 'white', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', fontWeight: 700 }}>
                    {selectedProduct.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={selectedProduct.status === 'active' ? 'Activo' : 'Inactivo'}
                      sx={{
                        background: selectedProduct.status === 'active' ? '#10b98120' : '#6b728020',
                        color: selectedProduct.status === 'active' ? '#10b981' : '#6b7280',
                        fontWeight: 600
                      }}
                    />
                    {selectedProduct.featured && (
                      <Chip
                        label="Destacado"
                        icon={<FeaturedIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          background: '#ffcc0020',
                          color: '#ffcc00',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <img
                      src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'}
                      alt={selectedProduct.name}
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: '12px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#5855ff', mb: 1, fontWeight: 600 }}>
                      Información General
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                      {selectedProduct.description}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Marca
                        </Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                          {selectedProduct.brand}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Modelo
                        </Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                          {selectedProduct.model}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          SKU
                        </Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                          {selectedProduct.sku}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Precio
                        </Typography>
                        <Typography sx={{ color: '#ffcc00', fontWeight: 700, fontSize: '1.25rem' }}>
                          {formatCurrency(selectedProduct.price)}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: '#ffcc00', mb: 1, fontWeight: 600 }}>
                      Especificaciones
                    </Typography>
                    {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Typography
                          component="span"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}
                        >
                          {key}:
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ color: 'white', ml: 1 }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDetailDialog(false)}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    toast.info('Funcionalidad de editar en desarrollo')
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #5855ff, #8b5cf6)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4c49f5, #7c3aed)'
                    }
                  }}
                >
                  Editar Producto
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  )
}

export default ProductsAdminWithMockData