import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Configuración global de React StrictMode
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)