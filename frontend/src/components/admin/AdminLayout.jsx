import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  useTheme,
  Collapse,
  Chip
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  CarRental as RentalsIcon,
  RateReview as ReviewsIcon,
  ContactMail as ContactsIcon,
  Email as NewsletterIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  List as ListIcon,
  BarChart as AnalyticsIcon,
  Category as CategoryIcon,
  LocalOffer as OffersIcon,
  MusicNote as MusicIcon,
  Check as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const drawerWidth = 280

const AdminLayout = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const [expandedMenus, setExpandedMenus] = useState({
    products: false,
    orders: false,
    users: false,
    reports: false
  })

  // Elementos del menú de navegación
  const navigationItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: DashboardIcon,
      exact: true
    },
    {
      title: 'Productos',
      icon: ProductsIcon,
      expandable: true,
      key: 'products',
      children: [
        { title: 'Todos los Productos', path: '/admin/products', icon: ListIcon },
        { title: 'Nuevo Producto', path: '/admin/products/new', icon: AddIcon },
        { title: 'Categorías', path: '/admin/categories', icon: CategoryIcon },
        { title: 'Stock Bajo', path: '/admin/products/low-stock', icon: NotificationsIcon }
      ]
    },
    {
      title: 'Pedidos',
      icon: OrdersIcon,
      expandable: true,
      key: 'orders',
      children: [
        { title: 'Todos los Pedidos', path: '/admin/orders', icon: ListIcon },
        { title: 'Pendientes', path: '/admin/orders/pending', icon: NotificationsIcon },
        { title: 'Completados', path: '/admin/orders/completed', icon: CheckIcon },
        { title: 'Cancelados', path: '/admin/orders/cancelled', icon: CancelIcon }
      ]
    },
    {
      title: 'Usuarios',
      icon: UsersIcon,
      expandable: true,
      key: 'users',
      children: [
        { title: 'Todos los Usuarios', path: '/admin/users', icon: ListIcon },
        { title: 'Nuevos Registros', path: '/admin/users/new', icon: AddIcon },
        { title: 'Administradores', path: '/admin/users/admins', icon: AccountIcon }
      ]
    },
    {
      title: 'Alquileres',
      path: '/admin/rentals',
      icon: RentalsIcon
    },
    {
      title: 'Reseñas',
      path: '/admin/reviews',
      icon: ReviewsIcon
    },
    {
      title: 'Contactos',
      path: '/admin/contacts',
      icon: ContactsIcon
    },
    {
      title: 'Newsletter',
      path: '/admin/newsletter',
      icon: NewsletterIcon
    },
    {
      title: 'Reportes',
      icon: ReportsIcon,
      expandable: true,
      key: 'reports',
      children: [
        { title: 'Ventas', path: '/admin/reports/sales', icon: AnalyticsIcon },
        { title: 'Productos', path: '/admin/reports/products', icon: ProductsIcon },
        { title: 'Usuarios', path: '/admin/reports/users', icon: UsersIcon }
      ]
    },
    {
      title: 'Configuración',
      path: '/admin/settings',
      icon: SettingsIcon
    }
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMenuExpand = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const isActivePath = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  // Contenido del drawer
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del admin panel */}
      <Box sx={{
        p: 3,
        background: 'linear-gradient(135deg, #5855ff 0%, #8b5cf6 50%, #ffcc00 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <MusicIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 700 }}>
            Epk Música
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Panel Administrativo
        </Typography>
      </Box>

      <Divider />

      {/* Navegación */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {navigationItems.map((item, index) => {
          if (item.expandable) {
            return (
              <Box key={index}>
                <ListItemButton
                  onClick={() => handleMenuExpand(item.key)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&:hover': {
                      background: 'rgba(88, 85, 255, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <item.icon sx={{ 
                      color: expandedMenus[item.key] ? '#5855ff' : 'rgba(255, 255, 255, 0.7)' 
                    }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: expandedMenus[item.key] ? '#5855ff' : 'white',
                        fontWeight: expandedMenus[item.key] ? 600 : 400
                      }
                    }}
                  />
                  {expandedMenus[item.key] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                
                <Collapse in={expandedMenus[item.key]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, childIndex) => (
                      <ListItemButton
                        key={childIndex}
                        onClick={() => {
                          navigate(child.path)
                          if (isMobile) setMobileOpen(false)
                        }}
                        sx={{
                          pl: 4,
                          borderRadius: 2,
                          mb: 0.5,
                          bgcolor: isActivePath(child.path) ? 'rgba(88, 85, 255, 0.15)' : 'transparent',
                          borderLeft: isActivePath(child.path) ? '3px solid #5855ff' : 'none',
                          '&:hover': {
                            background: 'rgba(88, 85, 255, 0.1)'
                          }
                        }}
                      >
                        <ListItemIcon>
                          <child.icon sx={{ 
                            fontSize: 20,
                            color: isActivePath(child.path) ? '#5855ff' : 'rgba(255, 255, 255, 0.6)' 
                          }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={child.title}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '0.875rem',
                              color: isActivePath(child.path) ? '#5855ff' : 'rgba(255, 255, 255, 0.8)',
                              fontWeight: isActivePath(child.path) ? 600 : 400
                            }
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )
          }

          return (
            <ListItemButton
              key={index}
              onClick={() => {
                navigate(item.path)
                if (isMobile) setMobileOpen(false)
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: isActivePath(item.path, item.exact) ? 'rgba(88, 85, 255, 0.15)' : 'transparent',
                borderLeft: isActivePath(item.path, item.exact) ? '3px solid #5855ff' : 'none',
                '&:hover': {
                  background: 'rgba(88, 85, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon>
                <item.icon sx={{ 
                  color: isActivePath(item.path, item.exact) ? '#5855ff' : 'rgba(255, 255, 255, 0.7)' 
                }} />
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: isActivePath(item.path, item.exact) ? '#5855ff' : 'white',
                    fontWeight: isActivePath(item.path, item.exact) ? 600 : 400
                  }
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* Usuario admin info */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          p: 2,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #5855ff, #ffcc00)',
              fontSize: '1rem'
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Chip
              label="Administrador"
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 20,
                background: 'rgba(255, 204, 0, 0.2)',
                color: '#ffcc00',
                border: '1px solid #ffcc00'
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* El título se puede cambiar dinámicamente según la página */}
          </Typography>

          {/* Acciones del header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="large"
              color="inherit"
              sx={{
                '&:hover': {
                  background: 'rgba(88, 85, 255, 0.1)'
                }
              }}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
              sx={{
                '&:hover': {
                  background: 'rgba(88, 85, 255, 0.1)'
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #5855ff, #ffcc00)',
                  fontSize: '0.9rem'
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu de usuario */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        sx={{
          '& .MuiPaper-root': {
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            minWidth: 200
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            navigate('/admin/profile')
            handleUserMenuClose()
          }}
          sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
        >
          <AccountIcon sx={{ mr: 1 }} />
          Mi Perfil
        </MenuItem>
        <MenuItem 
          onClick={() => {
            navigate('/admin/settings')
            handleUserMenuClose()
          }}
          sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
        >
          <SettingsIcon sx={{ mr: 1 }} />
          Configuración
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem 
          onClick={handleLogout}
          sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Navigation drawer */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
        aria-label="admin navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #0a0a0a 0%, #171717 100%)',
              color: 'white',
              border: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #0a0a0a 0%, #171717 100%)',
              color: 'white',
              border: 'none',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #171717 100%)'
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  )
}

export default AdminLayout