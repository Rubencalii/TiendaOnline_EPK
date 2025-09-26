import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
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
  InputAdornment,
  Fade,
  Alert
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Warning as WarningIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  CheckCircle,
  Inventory as StockIcon
} from '@mui/icons-material'
import toast from 'react-hot-toast'

const ProductsAdmin = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'

  // Datos de ejemplo (en producción vendrían del backend)
  const mockProducts = [
    {
      _id: '1',
      name: 'Guitarra Acústica Yamaha FG830',
      description: 'Guitarra acústica de alta calidad con sonido excepcional',
      price: 299.99,
      salePrice: null,
      category: 'Guitarras',
      brand: 'Yamaha',
      stock: 15,
      images: ['/api/placeholder/300/300'],
      status: 'active',
      featured: true,
      createdAt: '2024-03-01',
      updatedAt: '2024-03-10'
    },
    {
      _id: '2',
      name: 'Micrófono Shure SM58',
      description: 'Micrófono dinámico profesional para voces',
      price: 150.00,
      salePrice: 135.00,
      category: 'Sonido',
      brand: 'Shure',
      stock: 3,
      images: ['/api/placeholder/300/300'],
      status: 'active',
      featured: false,
      createdAt: '2024-02-15',
      updatedAt: '2024-03-05'
    },
    {
      _id: '3',
      name: 'Foco LED RGB 50W',
      description: 'Foco LED con cambio de colores para iluminación de eventos',
      price: 89.99,
      salePrice: null,
      category: 'Iluminación',
      brand: 'Generic',
      stock: 0,
      images: ['/api/placeholder/300/300'],
      status: 'inactive',
      featured: false,
      createdAt: '2024-01-20',
      updatedAt: '2024-03-01'
    }
  ]

  const categories = ['Guitarras', 'Bajos', 'Baterías', 'Sonido', 'Iluminación', 'Accesorios']

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, statusFilter, categoryFilter, stockFilter])

  const loadProducts = async () => {
    setLoading(true)
    try {
      // Aquí iría la llamada al backend
      // const response = await fetch('/api/admin/products')
      // const data = await response.json()
      setTimeout(() => {
        setProducts(mockProducts)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error cargando productos:', error)
      toast.error('Error al cargar productos')
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter)
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    // Filtro por stock
    if (stockFilter === 'low') {
      filtered = filtered.filter(product => product.stock > 0 && product.stock <= 5)
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(product => product.stock === 0)
    } else if (stockFilter === 'in-stock') {
      filtered = filtered.filter(product => product.stock > 5)
    }

    setFilteredProducts(filtered)
  }

  const handleActionMenuOpen = (event, product) => {
    setActionMenuAnchor(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      // Aquí iría la llamada al backend para eliminar
      // await fetch(`/api/admin/products/${selectedProduct._id}`, { method: 'DELETE' })
      
      setProducts(prev => prev.filter(p => p._id !== selectedProduct._id))
      toast.success('Producto eliminado correctamente')
      setDeleteDialog(false)
      handleActionMenuClose()
    } catch (error) {
      console.error('Error eliminando producto:', error)
      toast.error('Error al eliminar producto')
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active'
      // Aquí iría la llamada al backend
      
      setProducts(prev =>
        prev.map(p =>
          p._id === product._id ? { ...p, status: newStatus } : p
        )
      )
      toast.success(`Producto ${newStatus === 'active' ? 'activado' : 'desactivado'}`)
      handleActionMenuClose()
    } catch (error) {
      console.error('Error cambiando estado:', error)
      toast.error('Error al cambiar estado del producto')
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Sin Stock', color: 'error', icon: WarningIcon }
    if (stock <= 5) return { label: 'Stock Bajo', color: 'warning', icon: WarningIcon }
    return { label: 'En Stock', color: 'success', icon: CheckCircle }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
              Gestión de Productos
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {filteredProducts.length} productos encontrados
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/products/new')}
            sx={{
              background: 'linear-gradient(135deg, #5855ff, #8b5cf6)',
              color: 'white',
              px: 3,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #4c49f5, #7c3aed)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Nuevo Producto
          </Button>
        </Box>

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
              <Grid item xs={12} md={4}>
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
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Estado"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="active">Activos</MenuItem>
                    <MenuItem value="inactive">Inactivos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Categoría</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Categoría"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Stock</InputLabel>
                  <Select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    label="Stock"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="in-stock">En Stock</MenuItem>
                    <MenuItem value="low">Stock Bajo</MenuItem>
                    <MenuItem value="out">Sin Stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setCategoryFilter('all')
                    setStockFilter('all')
                  }}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#ffcc00',
                      background: 'rgba(255, 204, 0, 0.1)'
                    }
                  }}
                >
                  Limpiar Filtros
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Alertas de stock */}
        {filteredProducts.some(p => p.stock <= 5) && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b'
            }}
          >
            Tienes {filteredProducts.filter(p => p.stock <= 5 && p.stock > 0).length} productos con stock bajo
            y {filteredProducts.filter(p => p.stock === 0).length} productos sin stock.
          </Alert>
        )}

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
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => {
                    const stockStatus = getStockStatus(product.stock)
                    return (
                      <TableRow
                        key={product._id}
                        sx={{
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.02)'
                          }
                        }}
                      >
                        <TableCell sx={{ border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {product.brand}
                              </Typography>
                              {product.featured && (
                                <Chip
                                  label="Destacado"
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    fontSize: '0.7rem',
                                    height: 20,
                                    background: 'rgba(255, 204, 0, 0.2)',
                                    color: '#ffcc00'
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <Chip
                            label={product.category}
                            size="small"
                            sx={{
                              background: 'rgba(88, 85, 255, 0.2)',
                              color: '#5855ff',
                              border: '1px solid #5855ff40'
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <Box>
                            {product.salePrice ? (
                              <Box>
                                <Typography variant="body1" sx={{ color: '#10b981', fontWeight: 600 }}>
                                  €{product.salePrice}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    textDecoration: 'line-through'
                                  }}
                                >
                                  €{product.price}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                €{product.price}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <Chip
                            icon={<stockStatus.icon />}
                            label={`${product.stock} - ${stockStatus.label}`}
                            size="small"
                            color={stockStatus.color}
                            sx={{
                              background: `rgba(${stockStatus.color === 'error' ? '239, 68, 68' : stockStatus.color === 'warning' ? '245, 158, 11' : '16, 185, 129'}, 0.2)`,
                              color: stockStatus.color === 'error' ? '#ef4444' : stockStatus.color === 'warning' ? '#f59e0b' : '#10b981'
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <Chip
                            icon={product.status === 'active' ? <ActiveIcon /> : <InactiveIcon />}
                            label={product.status === 'active' ? 'Activo' : 'Inactivo'}
                            size="small"
                            sx={{
                              background: product.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: product.status === 'active' ? '#10b981' : '#ef4444'
                            }}
                          />
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
                    )
                  })}
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
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              '& .MuiTablePagination-select': {
                color: 'white'
              },
              '& .MuiTablePagination-selectIcon': {
                color: 'white'
              }
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
              navigate(`/admin/products/${selectedProduct?._id}`)
              handleActionMenuClose()
            }}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
          >
            <ViewIcon sx={{ mr: 1 }} />
            Ver Detalles
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/admin/products/${selectedProduct?._id}/edit`)
              handleActionMenuClose()
            }}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => handleToggleStatus(selectedProduct)}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
          >
            {selectedProduct?.status === 'active' ? <InactiveIcon sx={{ mr: 1 }} /> : <ActiveIcon sx={{ mr: 1 }} />}
            {selectedProduct?.status === 'active' ? 'Desactivar' : 'Activar'}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeleteDialog(true)
              handleActionMenuClose()
            }}
            sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog de confirmación de eliminación */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          sx={{
            '& .MuiPaper-root': {
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ color: 'white' }}>
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              ¿Estás seguro de que quieres eliminar el producto "{selectedProduct?.name}"?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialog(false)}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteProduct}
              sx={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)'
                }
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default ProductsAdmin