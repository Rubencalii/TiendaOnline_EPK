import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Fade,
  Divider
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Inventory as ProductsIcon,
  AttachMoney as RevenueIcon,
  StarRate as ReviewsIcon,
  CarRental as RentalsIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon,
  Schedule as PendingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const theme = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({})
  const [recentOrders, setRecentOrders] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Datos de estadísticas simuladas (en producción vendrían del backend)
  const mockStats = {
    totalRevenue: 15420.50,
    totalOrders: 342,
    totalUsers: 1247,
    totalProducts: 156,
    totalReviews: 89,
    totalRentals: 23,
    
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    usersGrowth: 15.2,
    productsGrowth: 5.1,
    
    pendingOrders: 8,
    completedOrders: 315,
    cancelledOrders: 19,
    
    lowStockProducts: 5,
    outOfStockProducts: 2
  }

  const mockRecentOrders = [
    {
      id: 'ORD-001',
      customer: 'María González',
      total: 299.99,
      status: 'pending',
      date: '2024-03-15',
      items: 2
    },
    {
      id: 'ORD-002',
      customer: 'Juan Pérez',
      total: 150.00,
      status: 'completed',
      date: '2024-03-14',
      items: 1
    },
    {
      id: 'ORD-003',
      customer: 'Ana Martín',
      total: 89.99,
      status: 'shipped',
      date: '2024-03-14',
      items: 3
    }
  ]

  const mockRecentUsers = [
    {
      id: 1,
      name: 'Carlos Ruiz',
      email: 'carlos@email.com',
      joinDate: '2024-03-15',
      orders: 0,
      status: 'new'
    },
    {
      id: 2,
      name: 'Laura Silva',
      email: 'laura@email.com',
      joinDate: '2024-03-14',
      orders: 2,
      status: 'active'
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      setLoading(true)
      // Aquí irían las llamadas reales al backend
      setTimeout(() => {
        setStats(mockStats)
        setRecentOrders(mockRecentOrders)
        setRecentUsers(mockRecentUsers)
        setLoading(false)
      }, 1000)
    }
    
    loadData()
  }, [])

  // Tarjetas de estadísticas
  const statCards = [
    {
      title: 'Ingresos Totales',
      value: `€${stats.totalRevenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      growth: stats.revenueGrowth,
      icon: RevenueIcon,
      color: '#ffcc00'
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders,
      growth: stats.ordersGrowth,
      icon: OrdersIcon,
      color: '#5855ff'
    },
    {
      title: 'Usuarios',
      value: stats.totalUsers,
      growth: stats.usersGrowth,
      icon: UsersIcon,
      color: '#8b5cf6'
    },
    {
      title: 'Productos',
      value: stats.totalProducts,
      growth: stats.productsGrowth,
      icon: ProductsIcon,
      color: '#00e5ff'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'completed': return '#10b981'
      case 'shipped': return '#5855ff'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'completed': return 'Completado'
      case 'shipped': return 'Enviado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
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
        {/* Header del Dashboard */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              color: 'white',
              mb: 1
            }}
          >
            Dashboard Administrativo
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Bienvenido, {user?.name} - Panel de control de Epk Música
          </Typography>
        </Box>

        {/* Tarjetas de estadísticas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={500 + index * 100}>
                  <Card
                    sx={{
                      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: `${card.color}40`,
                        boxShadow: `0 10px 25px ${card.color}20`
                      }
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Icon sx={{ fontSize: 32, color: card.color }} />
                        <Chip
                          size="small"
                          icon={card.growth > 0 ? <UpIcon /> : <DownIcon />}
                          label={`${card.growth > 0 ? '+' : ''}${card.growth}%`}
                          sx={{
                            background: card.growth > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: card.growth > 0 ? '#10b981' : '#ef4444',
                            border: `1px solid ${card.growth > 0 ? '#10b981' : '#ef4444'}40`
                          }}
                        />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                        {card.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {card.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            )
          })}
        </Grid>

        {/* Sección de alertas y estado */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ef4444', mb: 2, fontWeight: 600 }}>
                  Stock Bajo
                </Typography>
                <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 700 }}>
                  {stats.lowStockProducts}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Productos con stock bajo
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate('/admin/products?filter=low-stock')}
                  sx={{ color: '#ef4444', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}
                >
                  Ver Productos
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2, fontWeight: 600 }}>
                  Pedidos Pendientes
                </Typography>
                <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                  {stats.pendingOrders}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Requieren atención
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate('/admin/orders?status=pending')}
                  sx={{ color: '#f59e0b', '&:hover': { background: 'rgba(245, 158, 11, 0.1)' } }}
                >
                  Ver Pedidos
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: '#10b981', mb: 2, fontWeight: 600 }}>
                  Completados Hoy
                </Typography>
                <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 700 }}>
                  12
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Pedidos finalizados
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate('/admin/orders?status=completed&date=today')}
                  sx={{ color: '#10b981', '&:hover': { background: 'rgba(16, 185, 129, 0.1)' } }}
                >
                  Ver Detalles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Tablas de datos recientes */}
        <Grid container spacing={3}>
          {/* Pedidos recientes */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Pedidos Recientes
                  </Typography>
                  <Button
                    onClick={() => navigate('/admin/orders')}
                    sx={{ color: '#5855ff' }}
                  >
                    Ver Todos
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>
                          ID Pedido
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>
                          Cliente
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>
                          Total
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>
                          Estado
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>
                          Fecha
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          sx={{ 
                            '&:hover': { 
                              background: 'rgba(255, 255, 255, 0.02)',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <TableCell sx={{ color: '#5855ff', border: 'none', fontWeight: 600 }}>
                            {order.id}
                          </TableCell>
                          <TableCell sx={{ color: 'white', border: 'none' }}>
                            {order.customer}
                          </TableCell>
                          <TableCell sx={{ color: 'white', border: 'none', fontWeight: 600 }}>
                            €{order.total}
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>
                            <Chip
                              label={getStatusLabel(order.status)}
                              size="small"
                              sx={{
                                background: `${getStatusColor(order.status)}20`,
                                color: getStatusColor(order.status),
                                border: `1px solid ${getStatusColor(order.status)}40`
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>
                            {new Date(order.date).toLocaleDateString('es-ES')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Usuarios recientes */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Usuarios Nuevos
                  </Typography>
                  <Button
                    onClick={() => navigate('/admin/users')}
                    sx={{ color: '#5855ff' }}
                  >
                    Ver Todos
                  </Button>
                </Box>

                {recentUsers.map((user) => (
                  <Box
                    key={user.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #5855ff, #ffcc00)',
                        fontSize: '1rem'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {user.email}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={user.status === 'new' ? 'Nuevo' : 'Activo'}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            background: user.status === 'new' ? 'rgba(255, 204, 0, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: user.status === 'new' ? '#ffcc00' : '#10b981'
                          }}
                        />
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {user.orders} pedidos
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Acciones rápidas */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
            Acciones Rápidas
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/products/new')}
              sx={{
                borderColor: '#5855ff',
                color: '#5855ff',
                '&:hover': {
                  background: 'rgba(88, 85, 255, 0.1)',
                  borderColor: '#5855ff'
                }
              }}
            >
              Nuevo Producto
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/orders')}
              sx={{
                borderColor: '#ffcc00',
                color: '#ffcc00',
                '&:hover': {
                  background: 'rgba(255, 204, 0, 0.1)',
                  borderColor: '#ffcc00'
                }
              }}
            >
              Gestionar Pedidos
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/rentals')}
              sx={{
                borderColor: '#8b5cf6',
                color: '#8b5cf6',
                '&:hover': {
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: '#8b5cf6'
                }
              }}
            >
              Ver Alquileres
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/reports')}
              sx={{
                borderColor: '#00e5ff',
                color: '#00e5ff',
                '&:hover': {
                  background: 'rgba(0, 229, 255, 0.1)',
                  borderColor: '#00e5ff'
                }
              }}
            >
              Reportes
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Dashboard