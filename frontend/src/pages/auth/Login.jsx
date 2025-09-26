import React from 'react'
import { Box, Container, Typography } from '@mui/material'

const Login = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ color: 'white', mb: 4 }}>
          Iniciar Sesión
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Página de login en desarrollo...
        </Typography>
      </Container>
    </Box>
  )
}

export default Login