import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Avatar,
  Divider,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  LocalShipping as ShipIcon,
  CheckCircle as CompleteIcon,
  Cancel as CancelIcon,
  MoreVert as MoreIcon,
  Payment as PaymentIcon,
  Schedule as PendingIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material'
import toast from 'react-hot-toast'

const OrdersAdmin = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [detailDialog, setDetailDialog] = useState(false)
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  // Datos de ejemplo
  const mockOrders = [
    {
      _id: 'ORD-2024-001',
      orderNumber: 'EPK-001',
      customer: {
        name: 'María González',
        email: 'maria@email.com',
        phone: '+34 666 123 456'
      },
      items: [
        {
          product: 'Guitarra Acústica Yamaha FG830',
          quantity: 1,
          price: 299.99
        },
        {
          product: 'Funda para guitarra',
          quantity: 1,
          price: 25.00
        }
      ],
      subtotal: 324.99,
      shipping: 15.00,
      total: 339.99,
      status: 'pending',
      paymentMethod: 'Tarjeta',
      paymentStatus: 'paid',
      shippingAddress: {
        street: 'Calle Principal 123',
        city: 'Granada',
        postalCode: '18001',
        country: 'España'
      },
      tracking: null,
      createdAt: '2024-03-15T10:30:00Z',
      updatedAt: '2024-03-15T10:30:00Z',
      notes: 'Cliente solicitó envío urgente'
    },
    {
      _id: 'ORD-2024-002',
      orderNumber: 'EPK-002',
      customer: {
        name: 'Juan Pérez',
        email: 'juan@email.com',
        phone: '+34 666 789 012'
      },
      items: [
        {
          product: 'Micrófono Shure SM58',
          quantity: 2,
          price: 135.00
        }
      ],
      subtotal: 270.00,
      shipping: 10.00,
      total: 280.00,
      status: 'shipped',
      paymentMethod: 'PayPal',
      paymentStatus: 'paid',
      shippingAddress: {
        street: 'Av. Andalucía 456',
        city: 'Atarfe',
        postalCode: '18230',
        country: 'España'
      },
      tracking: 'ES123456789',
      createdAt: '2024-03-14T15:45:00Z',
      updatedAt: '2024-03-15T09:00:00Z',
      notes: null
    }
  ]

  const orderStatuses = [
    { value: 'pending', label: 'Pendiente', color: '#f59e0b' },
    { value: 'processing', label: 'Procesando', color: '#5855ff' },
    { value: 'shipped', label: 'Enviado', color: '#00e5ff' },
    { value: 'delivered', label: 'Entregado', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelado', color: '#ef4444' }
  ]

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter, dateFilter])

  const loadOrders = async () => {
    setLoading(true)
    try {
      // Aquí iría la llamada al backend
      setTimeout(() => {
        setOrders(mockOrders)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error cargando pedidos:', error)
      toast.error('Error al cargar pedidos')
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setDate(now.getDate() - 30)
          break
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate)
      }
    }

    setFilteredOrders(filtered)
  }

  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status)
    return statusObj ? statusObj.color : '#6b7280'
  }

  const getStatusLabel = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status)
    return statusObj ? statusObj.label : status
  }

  const handleActionMenuOpen = (event, order) => {
    setActionMenuAnchor(event.currentTarget)
    setSelectedOrder(order)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setSelectedOrder(null)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      // Aquí iría la llamada al backend
      setOrders(prev =>
        prev.map(order =>
          order._id === selectedOrder._id
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      )
      
      toast.success(`Estado del pedido actualizado a: ${getStatusLabel(newStatus)}`)
      setStatusUpdateDialog(false)
      setNewStatus('')
      handleActionMenuClose()
    } catch (error) {
      console.error('Error actualizando estado:', error)
      toast.error('Error al actualizar el estado del pedido')
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              color: 'white',
              mb: 1
            }}
          >
            Gestión de Pedidos
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {filteredOrders.length} pedidos encontrados
          </Typography>
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
                  placeholder="Buscar por número, cliente o email..."
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

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Estado"
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {orderStatuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Fecha</InputLabel>
                  <Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    label="Fecha"
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="today">Hoy</MenuItem>
                    <MenuItem value="week">Última semana</MenuItem>
                    <MenuItem value="month">Último mes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setDateFilter('all')
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

        {/* Tabla de pedidos */}
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
                    Pedido
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Cliente
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Total
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow
                      key={order._id}
                      sx={{
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.02)',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => {
                        setSelectedOrder(order)
                        setDetailDialog(true)
                      }}
                    >
                      <TableCell sx={{ border: 'none' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: '#5855ff', fontWeight: 600 }}>
                            #{order.orderNumber}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              background: 'linear-gradient(135deg, #5855ff, #ffcc00)',
                              fontSize: '0.8rem'
                            }}
                          >
                            {order.customer.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                              {order.customer.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              {order.customer.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                          €{order.total.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {order.paymentMethod}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Chip
                          label={getStatusLabel(order.status)}
                          size="small"
                          sx={{
                            background: `${getStatusColor(order.status)}20`,
                            color: getStatusColor(order.status),
                            border: `1px solid ${getStatusColor(order.status)}40`,
                            fontWeight: 600
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {formatDate(order.createdAt)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ border: 'none' }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleActionMenuOpen(e, order)
                          }}
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
            count={filteredOrders.length}
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
              setStatusUpdateDialog(true)
              handleActionMenuClose()
            }}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Cambiar Estado
          </MenuItem>
          {selectedOrder?.status === 'pending' && (
            <MenuItem
              onClick={() => {
                setNewStatus('processing')
                handleUpdateStatus()
              }}
              sx={{ color: '#5855ff', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
            >
              <CheckCircle sx={{ mr: 1 }} />
              Confirmar Pedido
            </MenuItem>
          )}
        </Menu>

        {/* Dialog de detalles del pedido */}
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
          {selectedOrder && (
            <>
              <DialogTitle sx={{ color: 'white', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', fontWeight: 700 }}>
                    Pedido #{selectedOrder.orderNumber}
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedOrder.status)}
                    sx={{
                      background: `${getStatusColor(selectedOrder.status)}20`,
                      color: getStatusColor(selectedOrder.status),
                      fontWeight: 600
                    }}
                  />
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  {/* Información del cliente */}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#5855ff', mb: 2, fontWeight: 600 }}>
                          Información del Cliente
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                          <Typography sx={{ color: 'white' }}>{selectedOrder.customer.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {selectedOrder.customer.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {selectedOrder.customer.phone}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Dirección de envío */}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#ffcc00', mb: 2, fontWeight: 600 }}>
                          Dirección de Envío
                        </Typography>
                        <Typography sx={{ color: 'white', mb: 0.5 }}>
                          {selectedOrder.shippingAddress.street}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {selectedOrder.shippingAddress.country}
                        </Typography>
                        {selectedOrder.tracking && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#00e5ff', fontWeight: 600 }}>
                              Seguimiento: {selectedOrder.tracking}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Productos */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      Productos
                    </Typography>
                    {selectedOrder.items.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          mb: 1,
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2
                        }}
                      >
                        <Box>
                          <Typography sx={{ color: 'white', fontWeight: 600 }}>
                            {item.product}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Cantidad: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#ffcc00', fontWeight: 600 }}>
                          €{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}

                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

                    {/* Resumen de precios */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Subtotal:</Typography>
                        <Typography sx={{ color: 'white' }}>€{selectedOrder.subtotal.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Envío:</Typography>
                        <Typography sx={{ color: 'white' }}>€{selectedOrder.shipping.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>Total:</Typography>
                        <Typography sx={{ color: '#ffcc00', fontSize: '1.1rem' }}>
                          €{selectedOrder.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {selectedOrder.notes && (
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          background: 'rgba(255, 204, 0, 0.1)',
                          border: '1px solid rgba(255, 204, 0, 0.2)',
                          borderRadius: 2
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#ffcc00', mb: 1, fontWeight: 600 }}>
                            Notas del Pedido
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            {selectedOrder.notes}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
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
                    setDetailDialog(false)
                    setStatusUpdateDialog(true)
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #5855ff, #8b5cf6)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4c49f5, #7c3aed)'
                    }
                  }}
                >
                  Cambiar Estado
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Dialog para cambiar estado */}
        <Dialog
          open={statusUpdateDialog}
          onClose={() => setStatusUpdateDialog(false)}
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
            Cambiar Estado del Pedido
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Nuevo Estado</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Nuevo Estado"
                sx={{ color: 'white' }}
              >
                {orderStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: status.color
                        }}
                      />
                      {status.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setStatusUpdateDialog(false)
                setNewStatus('')
              }}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus}
              sx={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669, #047857)'
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Actualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default OrdersAdmin