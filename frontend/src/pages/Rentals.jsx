import React from 'react'
import { Box, Container, Typography } from '@mui/material'

const Rentals = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ color: 'white', mb: 4 }}>
          Alquiler de Equipos
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Página de alquiler en desarrollo...
        </Typography>
      </Container>
    </Box>
  )
}

export default Rentals