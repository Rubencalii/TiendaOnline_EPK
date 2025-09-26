import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Avatar,
  Divider,
  InputBase,
  Fade
} from '@mui/material'
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Inventory as ProductsIcon,
  ContactMail as ContactIcon,
  Info as AboutIcon,
  CarRental as RentalIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon,
  MusicNote as MusicIcon
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Estados para menús y drawer
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [scrolled, setScrolled] = useState(false)

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Menús de navegación
  const navigationItems = [
    { label: 'Inicio', path: '/', icon: HomeIcon },
    { label: 'Productos', path: '/productos', icon: ProductsIcon },
    { label: 'Alquiler', path: '/alquiler', icon: RentalIcon },
    { label: 'Nosotros', path: '/nosotros', icon: AboutIcon },
    { label: 'Contacto', path: '/contacto', icon: ContactIcon }
  ]

  // Manejar menú de usuario
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = () => {
    logout()
    handleUserMenuClose()
    navigate('/')
  }

  // Manejar drawer móvil
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/productos?buscar=${encodeURIComponent(searchValue.trim())}`)
      setSearchValue('')
      setMobileDrawerOpen(false)
    }
  }

  // Verificar si la ruta actual está activa
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // Drawer para móvil
  const drawer = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #5855ff 0%, #8b5cf6 50%, #ffcc00 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <MusicIcon sx={{ fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Playfair Display' }}>
          Epk Música
        </Typography>
        <IconButton 
          onClick={handleMobileDrawerToggle}
          sx={{ ml: 'auto', color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* Búsqueda móvil */}
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSearch}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            px: 1
          }}>
            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
            <InputBase
              placeholder="Buscar productos..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{ 
                flex: 1, 
                color: 'white',
                '& input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            />
          </Box>
        </form>
      </Box>
      
      <Divider />

      {/* Navegación */}
      <List>
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <ListItem
              key={item.path}
              button
              component={Link}
              to={item.path}
              onClick={handleMobileDrawerToggle}
              sx={{
                bgcolor: isActiveRoute(item.path) ? 'rgba(88, 85, 255, 0.1)' : 'transparent',
                borderLeft: isActiveRoute(item.path) ? '3px solid #5855ff' : 'none',
                '&:hover': {
                  bgcolor: 'rgba(88, 85, 255, 0.05)'
                }
              }}
            >
              <ListItemIcon>
                <Icon sx={{ color: isActiveRoute(item.path) ? '#5855ff' : 'rgba(255, 255, 255, 0.7)' }} />
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: isActiveRoute(item.path) ? '#5855ff' : 'white',
                    fontWeight: isActiveRoute(item.path) ? 600 : 400
                  }
                }}
              />
            </ListItem>
          )
        })}
      </List>

      <Divider />

      {/* Usuario móvil */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        {isAuthenticated ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  background: 'linear-gradient(135deg, #5855ff, #ffcc00)'
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            
            <Button
              fullWidth
              startIcon={<DashboardIcon />}
              component={Link}
              to="/perfil"
              onClick={handleMobileDrawerToggle}
              sx={{ 
                mb: 1, 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
              variant="outlined"
            >
              Mi Perfil
            </Button>
            
            <Button
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: '#ef4444'
                }
              }}
              variant="outlined"
            >
              Cerrar Sesión
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              fullWidth
              component={Link}
              to="/login"
              onClick={handleMobileDrawerToggle}
              sx={{ 
                mb: 1,
                background: 'linear-gradient(135deg, #5855ff, #8b5cf6)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4c49f5, #7c3aed)'
                }
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              fullWidth
              component={Link}
              to="/registro"
              onClick={handleMobileDrawerToggle}
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: '#ffcc00'
                }
              }}
            >
              Registrarse
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{
          background: scrolled 
            ? 'rgba(10, 10, 10, 0.95)' 
            : 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: scrolled 
            ? '1px solid rgba(88, 85, 255, 0.2)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          boxShadow: scrolled 
            ? '0 4px 20px rgba(88, 85, 255, 0.1)' 
            : 'none'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box 
            component={Link} 
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <MusicIcon 
              sx={{ 
                fontSize: 32, 
                color: '#5855ff',
                filter: 'drop-shadow(0 0 8px rgba(88, 85, 255, 0.5))'
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Playfair Display',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #5855ff 0%, #ffcc00 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Epk Música
            </Typography>
          </Box>

          {/* Navegación desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActiveRoute(item.path) ? '#ffcc00' : 'rgba(255, 255, 255, 0.9)',
                    fontWeight: isActiveRoute(item.path) ? 600 : 400,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#ffcc00',
                      background: 'rgba(255, 204, 0, 0.1)'
                    },
                    '&::after': isActiveRoute(item.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80%',
                      height: 2,
                      background: 'linear-gradient(90deg, #5855ff, #ffcc00)',
                      borderRadius: 1
                    } : {}
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Búsqueda desktop */}
          {!isMobile && (
            <Box sx={{ ml: 'auto', mr: 3 }}>
              <form onSubmit={handleSearch}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  px: 2,
                  py: 0.5,
                  transition: 'all 0.3s ease',
                  '&:focus-within': {
                    borderColor: '#5855ff',
                    background: 'rgba(88, 85, 255, 0.05)',
                    boxShadow: '0 0 20px rgba(88, 85, 255, 0.2)'
                  }
                }}>
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
                  <InputBase
                    placeholder="Buscar productos..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{ 
                      color: 'white',
                      width: 200,
                      '& input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)'
                      }
                    }}
                  />
                </Box>
              </form>
            </Box>
          )}

          {/* Acciones de usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: isMobile ? 'auto' : 0 }}>
            {/* Carrito */}
            <IconButton
              component={Link}
              to="/carrito"
              sx={{
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 204, 0, 0.1)',
                  color: '#ffcc00',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Badge 
                badgeContent={totalItems} 
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #5855ff, #ffcc00)',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              >
                <CartIcon />
              </Badge>
            </IconButton>

            {/* Usuario desktop */}
            {!isMobile && (
              <>
                {isAuthenticated ? (
                  <>
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(88, 85, 255, 0.1)',
                          transform: 'scale(1.1)'
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
                    
                    <Menu
                      anchorEl={userMenuAnchor}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleUserMenuClose}
                      sx={{
                        '& .MuiPaper-root': {
                          background: 'rgba(10, 10, 10, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          mt: 1
                        }
                      }}
                    >
                      <MenuItem 
                        component={Link} 
                        to="/perfil" 
                        onClick={handleUserMenuClose}
                        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(88, 85, 255, 0.1)' } }}
                      >
                        <DashboardIcon sx={{ mr: 1 }} />
                        Mi Perfil
                      </MenuItem>
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                      >
                        <LogoutIcon sx={{ mr: 1 }} />
                        Cerrar Sesión
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component={Link}
                      to="/login"
                      variant="outlined"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          borderColor: '#5855ff',
                          bgcolor: 'rgba(88, 85, 255, 0.1)'
                        }
                      }}
                    >
                      Entrar
                    </Button>
                    <Button
                      component={Link}
                      to="/registro"
                      sx={{
                        background: 'linear-gradient(135deg, #5855ff, #ffcc00)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4c49f5, #e6b800)'
                        }
                      }}
                    >
                      Registro
                    </Button>
                  </Box>
                )}
              </>
            )}

            {/* Menú móvil */}
            {isMobile && (
              <IconButton
                onClick={handleMobileDrawerToggle}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(88, 85, 255, 0.1)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer móvil */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'linear-gradient(180deg, #0a0a0a 0%, #171717 100%)',
            color: 'white'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer para compensar el AppBar fijo */}
      <Toolbar />
    </>
  )
}

export default Navbar