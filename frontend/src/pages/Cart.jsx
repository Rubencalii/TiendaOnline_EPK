import React from 'react'
import { Box, Container, Typography } from '@mui/material'

const Cart = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ color: 'white', mb: 4 }}>
          Carrito de Compras
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Página del carrito en desarrollo...
        </Typography>
      </Container>
    </Box>
  )
}

export default Cart