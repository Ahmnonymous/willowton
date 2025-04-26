import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/pagenotfoundbg.jpg';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        px: 2,
      }}
    >
      <Typography variant="h2" fontWeight="bold" sx={{ py: 4, px: 4, mb: 2, fontSize: '5rem', fontFamily: 'Sansation Light, sans-serif', fontWeight: 'bold', color: 'black', backgroundColor: 'white' }}>
        PAGE NOT FOUND
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{
          backgroundColor: 'white',
          color: 'black',
          fontWeight: 'bold',
          px: 4,
          py: 1.5,
          // borderRadius: '8px',
          fontFamily: 'Sansation Light, sans-serif',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        HOME
      </Button>
    </Box>
  );
};

export default PageNotFound;
