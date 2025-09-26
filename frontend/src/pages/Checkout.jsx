import React from 'react'
import { Box, Container, Typography } from '@mui/material'

const Checkout = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ color: 'white', mb: 4 }}>
          Checkout
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Página de checkout en desarrollo...
        </Typography>
      </Container>
    </Box>
  )
}

export default Checkout