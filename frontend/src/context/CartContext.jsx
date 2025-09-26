import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

// Estado inicial
const initialState = {
  items: [],
  total: 0,
  totalItems: 0,
  loading: false,
  error: null
}

// Tipos de acciones
const cartActions = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CALCULATE_TOTALS: 'CALCULATE_TOTALS',
  LOAD_CART: 'LOAD_CART'
}

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case cartActions.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      )

      let newItems
      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar cantidad
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        // Si es nuevo producto, agregarlo
        newItems = [...state.items, action.payload]
      }

      return {
        ...state,
        items: newItems,
        error: null
      }
    }

    case cartActions.REMOVE_ITEM: {
      const newItems = state.items.filter(
        item => item.product._id !== action.payload
      )
      return {
        ...state,
        items: newItems
      }
    }

    case cartActions.UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.product._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0) // Eliminar items con cantidad 0

      return {
        ...state,
        items: newItems
      }
    }

    case cartActions.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
        totalItems: 0
      }

    case cartActions.CALCULATE_TOTALS: {
      const total = state.items.reduce((sum, item) => {
        const price = item.product.salePrice || item.product.price
        return sum + (price * item.quantity)
      }, 0)

      const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        total: parseFloat(total.toFixed(2)),
        totalItems
      }
    }

    case cartActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }

    case cartActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }

    case cartActions.LOAD_CART:
      return {
        ...state,
        items: action.payload || []
      }

    default:
      return state
  }
}

// Crear contexto
const CartContext = createContext()

// Hook personalizado
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider')
  }
  return context
}

// Provider del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Cargar carrito desde localStorage al inicio
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('epk_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: cartActions.LOAD_CART, payload: parsedCart })
      }
    } catch (error) {
      console.error('Error cargando carrito:', error)
      localStorage.removeItem('epk_cart')
    }
  }, [])

  // Calcular totales cuando cambien los items
  useEffect(() => {
    dispatch({ type: cartActions.CALCULATE_TOTALS })
  }, [state.items])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    try {
      localStorage.setItem('epk_cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error guardando carrito:', error)
    }
  }, [state.items])

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    // Validar stock disponible
    if (product.stock < quantity) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`, {
        duration: 3000
      })
      return false
    }

    const cartItem = {
      product,
      quantity,
      selectedOptions,
      addedAt: new Date().toISOString()
    }

    dispatch({ type: cartActions.ADD_ITEM, payload: cartItem })
    
    toast.success(`🎵 ${product.name} agregado al carrito`, {
      duration: 2500,
      icon: '🛒'
    })

    return true
  }

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    const item = state.items.find(item => item.product._id === productId)
    
    if (item) {
      dispatch({ type: cartActions.REMOVE_ITEM, payload: productId })
      
      toast.success(`${item.product.name} eliminado del carrito`, {
        duration: 2000,
        icon: '🗑️'
      })
    }
  }

  // Actualizar cantidad de producto
  const updateQuantity = (productId, quantity) => {
    if (quantity < 0) return

    const item = state.items.find(item => item.product._id === productId)
    
    if (!item) return

    // Validar stock disponible
    if (quantity > item.product.stock) {
      toast.error(`Solo hay ${item.product.stock} unidades disponibles`, {
        duration: 3000
      })
      return
    }

    if (quantity === 0) {
      removeFromCart(productId)
    } else {
      dispatch({
        type: cartActions.UPDATE_QUANTITY,
        payload: { productId, quantity }
      })
    }
  }

  // Limpiar carrito
  const clearCart = () => {
    dispatch({ type: cartActions.CLEAR_CART })
    localStorage.removeItem('epk_cart')
    
    toast.success('Carrito vaciado', {
      duration: 2000,
      icon: '🧹'
    })
  }

  // Obtener cantidad de un producto específico en el carrito
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product._id === productId)
    return item ? item.quantity : 0
  }

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return state.items.some(item => item.product._id === productId)
  }

  // Calcular descuentos aplicables
  const calculateDiscount = () => {
    let discount = 0
    
    // Descuento por volumen (más de 5 productos)
    if (state.totalItems >= 5) {
      discount += state.total * 0.05 // 5% de descuento
    }

    // Descuento por monto (más de €500)
    if (state.total >= 500) {
      discount += state.total * 0.1 // 10% de descuento adicional
    }

    return parseFloat(discount.toFixed(2))
  }

  // Obtener resumen del carrito
  const getCartSummary = () => {
    const subtotal = state.total
    const discount = calculateDiscount()
    const shipping = subtotal > 100 ? 0 : 9.99 // Envío gratis por compras > €100
    const tax = (subtotal - discount) * 0.21 // IVA 21%
    const total = subtotal - discount + shipping + tax

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      items: state.totalItems
    }
  }

  // Validar carrito antes del checkout
  const validateCart = async () => {
    if (state.items.length === 0) {
      toast.error('Tu carrito está vacío', { duration: 3000 })
      return false
    }

    dispatch({ type: cartActions.SET_LOADING, payload: true })

    try {
      // Verificar disponibilidad y precios actualizados
      const productIds = state.items.map(item => item.product._id)
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productIds })
      })

      if (!response.ok) {
        throw new Error('Error validando productos')
      }

      const validProducts = await response.json()
      
      let hasChanges = false
      const updatedItems = state.items.map(item => {
        const validProduct = validProducts.find(p => p._id === item.product._id)
        
        if (!validProduct) {
          hasChanges = true
          toast.error(`${item.product.name} ya no está disponible`, {
            duration: 4000
          })
          return null
        }

        if (validProduct.stock < item.quantity) {
          hasChanges = true
          toast.warning(`Stock limitado: ${item.product.name} (disponible: ${validProduct.stock})`, {
            duration: 4000
          })
          return {
            ...item,
            quantity: validProduct.stock,
            product: validProduct
          }
        }

        if (validProduct.price !== item.product.price) {
          hasChanges = true
          toast.info(`Precio actualizado: ${item.product.name}`, {
            duration: 3000
          })
        }

        return {
          ...item,
          product: validProduct
        }
      }).filter(Boolean)

      if (hasChanges) {
        dispatch({ type: cartActions.LOAD_CART, payload: updatedItems })
        dispatch({ type: cartActions.SET_LOADING, payload: false })
        return false
      }

      dispatch({ type: cartActions.SET_LOADING, payload: false })
      return true

    } catch (error) {
      console.error('Error validando carrito:', error)
      dispatch({ 
        type: cartActions.SET_ERROR, 
        payload: 'Error validando productos' 
      })
      toast.error('Error validando carrito. Inténtalo de nuevo.', {
        duration: 4000
      })
      return false
    }
  }

  // Valor del contexto
  const contextValue = {
    // Estado
    items: state.items,
    total: state.total,
    totalItems: state.totalItems,
    loading: state.loading,
    error: state.error,

    // Funciones
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    calculateDiscount,
    getCartSummary,
    validateCart
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}