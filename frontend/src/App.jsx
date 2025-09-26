import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'
import { theme } from './theme/theme'
import './assets/styles.css'

// Componentes principales
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Páginas
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import Rentals from './pages/Rentals'
import RentalDetail from './pages/RentalDetail'
import Contact from './pages/Contact'
import About from './pages/About'
import NotFound from './pages/NotFound'

// Contextos
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Componente de carga musical
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="loading-music">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="text-white/70 font-display text-lg">
        Sintonizando tu experiencia musical...
      </p>
    </div>
  </div>
)

// Layout principal
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Páginas principales */}
                <Route path="/" element={
                  <Layout>
                    <Home />
                  </Layout>
                } />
                
                <Route path="/productos" element={
                  <Layout>
                    <Products />
                  </Layout>
                } />
                
                <Route path="/productos/:id" element={
                  <Layout>
                    <ProductDetail />
                  </Layout>
                } />
                
                <Route path="/carrito" element={
                  <Layout>
                    <Cart />
                  </Layout>
                } />
                
                <Route path="/checkout" element={
                  <Layout>
                    <Checkout />
                  </Layout>
                } />
                
                {/* Alquiler de equipos */}
                <Route path="/alquiler" element={
                  <Layout>
                    <Rentals />
                  </Layout>
                } />
                
                <Route path="/alquiler/:id" element={
                  <Layout>
                    <RentalDetail />
                  </Layout>
                } />
                
                {/* Autenticación */}
                <Route path="/login" element={
                  <Layout>
                    <Login />
                  </Layout>
                } />
                
                <Route path="/registro" element={
                  <Layout>
                    <Register />
                  </Layout>
                } />
                
                <Route path="/perfil" element={
                  <Layout>
                    <Profile />
                  </Layout>
                } />
                
                {/* Páginas de información */}
                <Route path="/contacto" element={
                  <Layout>
                    <Contact />
                  </Layout>
                } />
                
                <Route path="/nosotros" element={
                  <Layout>
                    <About />
                  </Layout>
                } />
                
                {/* Página 404 */}
                <Route path="*" element={
                  <Layout>
                    <NotFound />
                  </Layout>
                } />
              </Routes>
              
              {/* Notificaciones toast con tema musical */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: '#ffffff',
                    border: '1px solid rgba(88, 85, 255, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  },
                  success: {
                    style: {
                      border: '1px solid #10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                    },
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    style: {
                      border: '1px solid #ef4444',
                      background: 'rgba(239, 68, 68, 0.1)',
                    },
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                  loading: {
                    style: {
                      border: '1px solid #ffcc00',
                      background: 'rgba(255, 204, 0, 0.1)',
                    },
                    iconTheme: {
                      primary: '#ffcc00',
                      secondary: '#000000',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App