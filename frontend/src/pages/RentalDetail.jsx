import React from 'react'
import { Box, Container, Typography } from '@mui/material'

const RentalDetail = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ color: 'white', mb: 4 }}>
          Detalle del Alquiler
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Página de detalle de alquiler en desarrollo...
        </Typography>
      </Container>
    </Box>
  )
}

export default RentalDetail