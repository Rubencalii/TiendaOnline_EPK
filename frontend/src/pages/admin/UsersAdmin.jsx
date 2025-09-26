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
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  PersonAdd as AddUserIcon,
  MoreVert as MoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  ShoppingCart as OrdersIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Star as VipIcon
} from '@mui/icons-material'
import toast from 'react-hot-toast'

const UsersAdmin = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [detailDialog, setDetailDialog] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  // Datos de ejemplo
  const mockUsers = [
    {
      _id: 'user1',
      name: 'María González Pérez',
      email: 'maria.gonzalez@email.com',
      phone: '+34 666 123 456',
      role: 'customer',
      status: 'active',
      avatar: null,
      address: {
        street: 'Calle Principal 123',
        city: 'Granada',
        postalCode: '18001',
        country: 'España'
      },
      preferences: {
        newsletter: true,
        promotions: true,
        language: 'es'
      },
      stats: {
        totalOrders: 8,
        totalSpent: 1245.67,
        averageOrder: 155.71,
        lastOrder: '2024-03-15T10:30:00Z'
      },
      createdAt: '2023-08-15T09:30:00Z',
      lastLogin: '2024-03-15T14:22:00Z',
      recentOrders: [
        { id: 'EPK-001', date: '2024-03-15', total: 339.99, status: 'pending' },
        { id: 'EPK-087', date: '2024-02-28', total: 125.50, status: 'delivered' },
        { id: 'EPK-065', date: '2024-02-10', total: 89.99, status: 'delivered' }
      ]
    },
    {
      _id: 'user2',
      name: 'Juan Pérez Martín',
      email: 'juan.perez@email.com',
      phone: '+34 666 789 012',
      role: 'customer',
      status: 'active',
      avatar: null,
      address: {
        street: 'Av. Andalucía 456',
        city: 'Atarfe',
        postalCode: '18230',
        country: 'España'
      },
      preferences: {
        newsletter: false,
        promotions: true,
        language: 'es'
      },
      stats: {
        totalOrders: 15,
        totalSpent: 2890.45,
        averageOrder: 192.70,
        lastOrder: '2024-03-14T15:45:00Z'
      },
      createdAt: '2023-05-20T16:15:00Z',
      lastLogin: '2024-03-14T18:30:00Z',
      recentOrders: [
        { id: 'EPK-002', date: '2024-03-14', total: 280.00, status: 'shipped' },
        { id: 'EPK-078', date: '2024-03-01', total: 450.25, status: 'delivered' }
      ]
    },
    {
      _id: 'admin1',
      name: 'Carmen López García',
      email: 'carmen@epkmusica.com',
      phone: '+34 958 123 456',
      role: 'admin',
      status: 'active',
      avatar: null,
      address: {
        street: 'Plaza Mayor 1',
        city: 'Atarfe',
        postalCode: '18230',
        country: 'España'
      },
      preferences: {
        newsletter: true,
        promotions: false,
        language: 'es'
      },
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        averageOrder: 0,
        lastOrder: null
      },
      createdAt: '2023-01-10T08:00:00Z',
      lastLogin: '2024-03-15T09:15:00Z',
      recentOrders: []
    }
  ]

  const userRoles = [
    { value: 'customer', label: 'Cliente', color: '#10b981', icon: UserIcon },
    { value: 'admin', label: 'Administrador', color: '#5855ff', icon: AdminIcon },
    { value: 'vip', label: 'VIP', color: '#ffcc00', icon: VipIcon }
  ]

  const userStatuses = [
    { value: 'active', label: 'Activo', color: '#10b981' },
    { value: 'inactive', label: 'Inactivo', color: '#6b7280' },
    { value: 'blocked', label: 'Bloqueado', color: '#ef4444' }
  ]

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, statusFilter, roleFilter])

  const loadUsers = async () => {
    setLoading(true)
    try {
      // Aquí iría la llamada al backend
      setTimeout(() => {
        setUsers(mockUsers)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      toast.error('Error al cargar usuarios')
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      )
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    // Filtro por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const getRoleInfo = (role) => {
    return userRoles.find(r => r.value === role) || userRoles[0]
  }

  const getStatusInfo = (status) => {
    return userStatuses.find(s => s.value === status) || userStatuses[0]
  }

  const handleActionMenuOpen = (event, user) => {
    event.stopPropagation()
    setActionMenuAnchor(event.currentTarget)
    setSelectedUser(user)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setSelectedUser(null)
  }

  const handleStatusToggle = async (user, newStatus) => {
    try {
      // Aquí iría la llamada al backend
      setUsers(prev =>
        prev.map(u =>
          u._id === user._id
            ? { ...u, status: newStatus }
            : u
        )
      )
      
      const statusLabel = getStatusInfo(newStatus).label
      toast.success(`Usuario ${newStatus === 'blocked' ? 'bloqueado' : newStatus === 'active' ? 'activado' : 'desactivado'} correctamente`)
      handleActionMenuClose()
    } catch (error) {
      console.error('Error actualizando estado:', error)
      toast.error('Error al actualizar el estado del usuario')
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
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
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
              Gestión de Usuarios
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {filteredUsers.length} usuarios encontrados
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddUserIcon />}
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
            onClick={() => {
              // Navegar a crear usuario o abrir modal
              toast.info('Funcionalidad de crear usuario en desarrollo')
            }}
          >
            Nuevo Usuario
          </Button>
        </Box>

        {/* Estadísticas rápidas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
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
                      Total Usuarios
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {users.length}
                    </Typography>
                  </Box>
                  <UserIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
                      Usuarios Activos
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {users.filter(u => u.status === 'active').length}
                    </Typography>
                  </Box>
                  <ActiveIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
                      Administradores
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'black', fontWeight: 700 }}>
                      {users.filter(u => u.role === 'admin').length}
                    </Typography>
                  </Box>
                  <AdminIcon sx={{ fontSize: 40, color: 'rgba(0, 0, 0, 0.7)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
                      Nuevos (30d)
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {users.filter(u => {
                        const monthAgo = new Date()
                        monthAgo.setDate(monthAgo.getDate() - 30)
                        return new Date(u.createdAt) >= monthAgo
                      }).length}
                    </Typography>
                  </Box>
                  <DateIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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
                  placeholder="Buscar por nombre, email o teléfono..."
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
                    {userStatuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Rol</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Rol"
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {userRoles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
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
                    setRoleFilter('all')
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

        {/* Tabla de usuarios */}
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
                    Usuario
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Contacto
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Rol
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Pedidos
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Registro
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, border: 'none' }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    const roleInfo = getRoleInfo(user.role)
                    const statusInfo = getStatusInfo(user.status)
                    const RoleIcon = roleInfo.icon

                    return (
                      <TableRow
                        key={user._id}
                        sx={{
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.02)',
                            cursor: 'pointer'
                          }
                        }}
                        onClick={() => {
                          setSelectedUser(user)
                          setDetailDialog(true)
                        }}
                      >
                        <TableCell sx={{ border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                background: `linear-gradient(135deg, ${roleInfo.color}, ${roleInfo.color}aa)`,
                                fontWeight: 600
                              }}
                            >
                              {getInitials(user.name)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Último acceso: {formatDate(user.lastLogin)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}>
                              {user.email}
                            </Typography>
                            {user.phone && (
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {user.phone}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <Chip
                            icon={<RoleIcon sx={{ fontSize: 16 }} />}
                            label={roleInfo.label}
                            size="small"
                            sx={{
                              background: `${roleInfo.color}20`,
                              color: roleInfo.color,
                              border: `1px solid ${roleInfo.color}40`,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <Chip
                            label={statusInfo.label}
                            size="small"
                            sx={{
                              background: `${statusInfo.color}20`,
                              color: statusInfo.color,
                              border: `1px solid ${statusInfo.color}40`,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          {user.stats.totalOrders > 0 ? (
                            <Box>
                              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                {user.stats.totalOrders} pedidos
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#ffcc00' }}>
                                {formatCurrency(user.stats.totalSpent)}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Sin pedidos
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {formatDate(user.createdAt)}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ border: 'none' }}>
                          <IconButton
                            onClick={(e) => handleActionMenuOpen(e, user)}
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
            count={filteredUsers.length}
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
              toast.info('Funcionalidad de editar usuario en desarrollo')
              handleActionMenuClose()
            }}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Editar Usuario
          </MenuItem>
          {selectedUser?.status === 'active' ? (
            <MenuItem
              onClick={() => handleStatusToggle(selectedUser, 'blocked')}
              sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
            >
              <BlockIcon sx={{ mr: 1 }} />
              Bloquear Usuario
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => handleStatusToggle(selectedUser, 'active')}
              sx={{ color: '#10b981', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
            >
              <ActiveIcon sx={{ mr: 1 }} />
              Activar Usuario
            </MenuItem>
          )}
        </Menu>

        {/* Dialog de detalles del usuario */}
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
          {selectedUser && (
            <>
              <DialogTitle sx={{ color: 'white', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: `linear-gradient(135deg, ${getRoleInfo(selectedUser.role).color}, ${getRoleInfo(selectedUser.role).color}aa)`,
                      fontWeight: 700,
                      fontSize: '1.25rem'
                    }}
                  >
                    {getInitials(selectedUser.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', fontWeight: 700 }}>
                      {selectedUser.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={getRoleInfo(selectedUser.role).label}
                        size="small"
                        sx={{
                          background: `${getRoleInfo(selectedUser.role).color}20`,
                          color: getRoleInfo(selectedUser.role).color,
                          fontWeight: 600
                        }}
                      />
                      <Chip
                        label={getStatusInfo(selectedUser.status).label}
                        size="small"
                        sx={{
                          background: `${getStatusInfo(selectedUser.status).color}20`,
                          color: getStatusInfo(selectedUser.status).color,
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </DialogTitle>

              <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{
                      '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .Mui-selected': { color: '#5855ff' },
                      '& .MuiTabs-indicator': { backgroundColor: '#5855ff' }
                    }}
                  >
                    <Tab label="Información General" />
                    <Tab label="Estadísticas" />
                    <Tab label="Pedidos Recientes" />
                  </Tabs>
                </Box>

                {/* Tab 1: Información General */}
                {tabValue === 0 && (
                  <Grid container spacing={3}>
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
                            Datos de Contacto
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                            <Typography sx={{ color: 'white' }}>{selectedUser.email}</Typography>
                          </Box>
                          {selectedUser.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <PhoneIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {selectedUser.phone}
                              </Typography>
                            </Box>
                          )}
                          {selectedUser.address && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <LocationIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20, mt: 0.5 }} />
                              <Box>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                  {selectedUser.address.street}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                  {selectedUser.address.postalCode} {selectedUser.address.city}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                  {selectedUser.address.country}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

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
                            Información de Cuenta
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <DateIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                            <Box>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                                Registro
                              </Typography>
                              <Typography sx={{ color: 'white' }}>
                                {formatDate(selectedUser.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <UserIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                            <Box>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                                Último acceso
                              </Typography>
                              <Typography sx={{ color: 'white' }}>
                                {formatDate(selectedUser.lastLogin)}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {/* Tab 2: Estadísticas */}
                {tabValue === 1 && selectedUser.role === 'customer' && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: 2,
                          textAlign: 'center'
                        }}
                      >
                        <CardContent>
                          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                            {selectedUser.stats.totalOrders}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Pedidos Totales
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          background: 'linear-gradient(135deg, #5855ff, #4c49f5)',
                          borderRadius: 2,
                          textAlign: 'center'
                        }}
                      >
                        <CardContent>
                          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                            {formatCurrency(selectedUser.stats.totalSpent).replace('€', '')}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Total Gastado
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          background: 'linear-gradient(135deg, #ffcc00, #f59e0b)',
                          borderRadius: 2,
                          textAlign: 'center'
                        }}
                      >
                        <CardContent>
                          <Typography variant="h4" sx={{ color: 'black', fontWeight: 700 }}>
                            {formatCurrency(selectedUser.stats.averageOrder).replace('€', '')}
                          </Typography>
                          <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                            Ticket Medio
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          borderRadius: 2,
                          textAlign: 'center'
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                            {selectedUser.stats.lastOrder ? formatDate(selectedUser.stats.lastOrder).split(' ')[0] : 'Nunca'}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Último Pedido
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {tabValue === 1 && selectedUser.role !== 'customer' && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AdminIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Las estadísticas están disponibles solo para clientes
                    </Typography>
                  </Box>
                )}

                {/* Tab 3: Pedidos Recientes */}
                {tabValue === 2 && (
                  <Box>
                    {selectedUser.recentOrders && selectedUser.recentOrders.length > 0 ? (
                      <List>
                        {selectedUser.recentOrders.map((order, index) => (
                          <ListItem
                            key={order.id}
                            sx={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: 2,
                              mb: 1,
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  background: 'linear-gradient(135deg, #5855ff, #8b5cf6)',
                                  width: 40,
                                  height: 40
                                }}
                              >
                                <OrdersIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                    Pedido #{order.id}
                                  </Typography>
                                  <Typography sx={{ color: '#ffcc00', fontWeight: 600 }}>
                                    {formatCurrency(order.total)}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {formatDate(order.date)}
                                  </Typography>
                                  <Chip
                                    label={order.status === 'delivered' ? 'Entregado' : order.status === 'shipped' ? 'Enviado' : 'Pendiente'}
                                    size="small"
                                    sx={{
                                      background: order.status === 'delivered' ? '#10b98120' : order.status === 'shipped' ? '#00e5ff20' : '#f59e0b20',
                                      color: order.status === 'delivered' ? '#10b981' : order.status === 'shipped' ? '#00e5ff' : '#f59e0b'
                                    }}
                                  />
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <OrdersIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Sin pedidos recientes
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
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
                    toast.info('Funcionalidad de editar usuario en desarrollo')
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #5855ff, #8b5cf6)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4c49f5, #7c3aed)'
                    }
                  }}
                >
                  Editar Usuario
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  )
}

export default UsersAdmin