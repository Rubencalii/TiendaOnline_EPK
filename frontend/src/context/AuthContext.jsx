import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

// Estado inicial
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
}

// Tipos de acciones
const authActions = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case authActions.LOGIN_START:
    case authActions.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    
    case authActions.LOGIN_SUCCESS:
    case authActions.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    
    case authActions.LOGIN_FAILURE:
    case authActions.REGISTER_FAILURE:
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      }
    
    case authActions.LOGOUT:
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    
    case authActions.LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      }
    
    case authActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    
    case authActions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Crear contexto
const AuthContext = createContext()

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Cargar usuario al inicio
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        dispatch({ type: authActions.SET_LOADING, payload: false })
        return
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          dispatch({ type: authActions.LOAD_USER, payload: data.user })
        } else {
          localStorage.removeItem('token')
          dispatch({ type: authActions.SET_LOADING, payload: false })
        }
      } catch (error) {
        console.error('Error cargando usuario:', error)
        localStorage.removeItem('token')
        dispatch({ type: authActions.SET_LOADING, payload: false })
      }
    }

    loadUser()
  }, [])

  // Función de login
  const login = async (credentials) => {
    dispatch({ type: authActions.LOGIN_START })
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({
          type: authActions.LOGIN_SUCCESS,
          payload: {
            user: data.user,
            token: data.token
          }
        })
        
        toast.success('¡Bienvenido de vuelta a Epk Música! 🎵', {
          duration: 3000,
          icon: '🎸'
        })
        
        return { success: true, data }
      } else {
        dispatch({
          type: authActions.LOGIN_FAILURE,
          payload: data.message || 'Error en el login'
        })
        
        toast.error(data.message || 'Error al iniciar sesión', {
          duration: 4000
        })
        
        return { success: false, error: data.message }
      }
    } catch (error) {
      console.error('Error en login:', error)
      const errorMessage = 'Error de conexión. Por favor, inténtalo de nuevo.'
      
      dispatch({
        type: authActions.LOGIN_FAILURE,
        payload: errorMessage
      })
      
      toast.error(errorMessage, {
        duration: 4000
      })
      
      return { success: false, error: errorMessage }
    }
  }

  // Función de registro
  const register = async (userData) => {
    dispatch({ type: authActions.REGISTER_START })
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({
          type: authActions.REGISTER_SUCCESS,
          payload: {
            user: data.user,
            token: data.token
          }
        })
        
        toast.success('¡Cuenta creada exitosamente! Bienvenido a Epk Música 🎵', {
          duration: 4000,
          icon: '🎉'
        })
        
        return { success: true, data }
      } else {
        dispatch({
          type: authActions.REGISTER_FAILURE,
          payload: data.message || 'Error en el registro'
        })
        
        toast.error(data.message || 'Error al crear cuenta', {
          duration: 4000
        })
        
        return { success: false, error: data.message }
      }
    } catch (error) {
      console.error('Error en registro:', error)
      const errorMessage = 'Error de conexión. Por favor, inténtalo de nuevo.'
      
      dispatch({
        type: authActions.REGISTER_FAILURE,
        payload: errorMessage
      })
      
      toast.error(errorMessage, {
        duration: 4000
      })
      
      return { success: false, error: errorMessage }
    }
  }

  // Función de logout
  const logout = () => {
    dispatch({ type: authActions.LOGOUT })
    toast.success('Sesión cerrada correctamente', {
      icon: '👋',
      duration: 2000
    })
  }

  // Función para actualizar perfil
  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify(updatedData)
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: authActions.LOAD_USER, payload: data.user })
        
        toast.success('Perfil actualizado correctamente', {
          icon: '✅',
          duration: 3000
        })
        
        return { success: true, data }
      } else {
        toast.error(data.message || 'Error al actualizar perfil', {
          duration: 4000
        })
        
        return { success: false, error: data.message }
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      const errorMessage = 'Error de conexión. Por favor, inténtalo de nuevo.'
      
      toast.error(errorMessage, {
        duration: 4000
      })
      
      return { success: false, error: errorMessage }
    }
  }

  // Función para cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify(passwordData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Contraseña cambiada correctamente', {
          icon: '🔒',
          duration: 3000
        })
        
        return { success: true, data }
      } else {
        toast.error(data.message || 'Error al cambiar contraseña', {
          duration: 4000
        })
        
        return { success: false, error: data.message }
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      const errorMessage = 'Error de conexión. Por favor, inténtalo de nuevo.'
      
      toast.error(errorMessage, {
        duration: 4000
      })
      
      return { success: false, error: errorMessage }
    }
  }

  // Limpiar errores
  const clearError = () => {
    dispatch({ type: authActions.CLEAR_ERROR })
  }

  // Valor del contexto
  const contextValue = {
    // Estado
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    
    // Funciones
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}