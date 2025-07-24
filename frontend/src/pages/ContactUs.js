import React from 'react';
import { Box, Grid, TextField, Typography, Button, Container, Link } from "@mui/material";
import footerImage from '../images/footer.png';

const ContactUs = () => {
  // Define font sizes as variables
  const fontSizes = {
    h4: '2.5rem',
    body1: '1.2rem',
    h6: '1.2rem',
    listItemText: '1.1rem',
    caption: '1rem',
  };

  const textStyle = {
    color: "white",
    fontFamily: "Sansation Light",
    fontSize: fontSizes.body1
  };

  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '2px',
    '& .MuiInputBase-input': {
      color: '#DE3831',
      fontFamily: "Sansation Light",
      fontWeight: "bolder"
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '2px'
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Ensures the parent takes at least the full screen height
    >
      <Container
        sx={{
          py: 4,
          mb: 0,
          maxWidth: 'none', // Removes the max-width constraint
          '@media (min-width:1200px)': {
            maxWidth: '100%', // Ensures the container spans the full width on larger screens
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            ...textStyle,
            fontWeight: "bold",
            fontSize: fontSizes.h4,
            mb: 4
          }}
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
          mt: -1,
          py: 4,
          px: 2,
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            ...textStyle,
            fontWeight: "bold",
            fontSize: fontSizes.h4,
            marginBottom: '40px'
          }}
        >
          Find Us
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h6" fontWeight={'bold'} sx={{ fontFamily: "Sansation Light" }}>AT</Typography>
            <Typography sx={{ ...textStyle }}>91 Beatrice St, Durban</Typography>
            <Typography sx={{ ...textStyle }}>Central, Durban, KZN South Africa</Typography>
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h6" fontWeight={'bold'} sx={{ fontFamily: "Sansation Light" }}>ON</Typography>
            <Typography sx={{ ...textStyle }}>Phone: (+27) 31 309 6786</Typography>
            <Typography sx={{ ...textStyle }}>Name: Humza Mthembu</Typography>
            <Typography sx={{ ...textStyle }}>Mail: humza.mthembu@sanzaf.org.za</Typography>
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Typography sx={{ fontFamily: "Sansation Light" }} fontWeight={'bold'} variant="h6">DURING</Typography>
            <Typography sx={{ ...textStyle }}>Monday - Friday:</Typography>
            <Typography sx={{ ...textStyle }}>08:00 a.m. - 4:00 p.m</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Footer Section */}
      <Box sx={{ marginTop: 'auto' }}>
        <Box
          component="img"
          src={footerImage}
          alt="Graduates"
          sx={{ width: '100%', height: 'auto', mb: 1 }}
        />
        <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontFamily: 'Sansation Light, Arial, sans-serif',
              fontSize: fontSizes.caption,
            }}
          >
            Developed by{' '}
            <Link
              href="https://uchakide.co.za"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'white' }} // optional: match text color
            >
              uchakide.co.za
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUs;
