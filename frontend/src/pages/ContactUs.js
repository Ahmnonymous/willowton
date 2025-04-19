import React from 'react';
import { Box, Grid, TextField, Typography, Button, Container } from "@mui/material";
import footerImage from '../images/footer.png';

const ContactUs = () => {
  const textStyle = {
    color: "white",
    fontFamily: "Sansation Light",
    fontSize: '0.9rem'
  };

  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '2px',
    '& .MuiInputBase-input': {
      color: '#DE3831',
      fontFamily: "Sansation Light"
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '2px'
    }
  };

  return (
    <div>
    <Container maxWidth="md" sx={{ py: 4,mb:-1 }}>
      <Box>
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ ...textStyle, fontWeight: "bold", fontSize: '3.3rem' }}
          >
            Contact Us
          </Typography>

          <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Name"
                  fullWidth
                  required
                  sx={inputStyle}
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Surname"
                  fullWidth
                  required
                  sx={inputStyle}
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Cell Number"
                  fullWidth
                  required
                  sx={inputStyle}
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Email Address"
                  fullWidth
                  required
                  type="email"
                  sx={inputStyle}
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Message"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  sx={inputStyle}
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: 'white',
                    color: '#DE3831',
                    fontFamily: "Sansation Light",
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    }
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>

        {/* Footer-style Region */}
        <Box
          sx={{
            backgroundColor: "#db3d35",
            color: "white",
            mt: 5,
            py: 4,
            px: 2,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ ...textStyle, fontWeight: "bold", fontSize: '4rem', marginBottom: '40px' }}
          >
            Find Us
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={4} textAlign="center">
              <Typography variant="h6" fontWeight={'bold'} sx={{fontFamily: "Sansation Light"}}>AT</Typography>
              <Typography sx={{ ...textStyle}}>91 Beatrice St, Durban</Typography>
              <Typography sx={{ ...textStyle}}>Central, Durban, KZN South Africa</Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography variant="h6" fontWeight={'bold'} sx={{fontFamily: "Sansation Light"}}>ON</Typography>
              <Typography sx={{ ...textStyle}}>Phone: (+27) 31 309 6786</Typography>
              <Typography sx={{ ...textStyle}}>Name: Razia Hamid</Typography>
              <Typography sx={{ ...textStyle}}>Mail: Razia.Hamid@Sanzaf.org.za</Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography sx={{fontFamily: "Sansation Light"}} fontWeight={'bold'} variant="h6">DURING</Typography>
              <Typography sx={{ ...textStyle}}>Monday - Friday:</Typography>
              <Typography sx={{ ...textStyle}}>08:00 a.m. - 4:00 p.m</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      </Container>

      <Box
          component="img"
          src={footerImage} // Replace with actual image path or URL
          alt="Graduates"
          sx={{ width: '100%', height: 'auto', mb: 1 }}
        />
      <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black'}}>
        <Typography variant="caption" sx={{ color: 'white', fontFamily: 'Sansation Light, sans-serif', fontSize: '1rem'  }}>
          Developed by Uchakide.co.za
        </Typography>
      </Box>

    </div>
  );
};

export default ContactUs;
