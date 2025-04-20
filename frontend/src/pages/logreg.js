import React, { useState } from "react";
import { Box, Button, TextField, Typography, ToggleButtonGroup, ToggleButton, IconButton, InputAdornment } from "@mui/material";
import { AccountCircle, Lock, PersonAdd, Email, Visibility, VisibilityOff } from "@mui/icons-material";
// import footerImage from '../images/footer.png';

const LoginSignup = () => {
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  // Define font sizes as variables
  const fontSizes = {
    h4: '2.5rem',
    h6: '2rem',
    body1: '1rem',
    listItemText: '1.1rem',
    caption: '1rem',
  };

  // const textStyle = {
  //   color: "black",
  //   fontFamily: "Sansation Light",
  //   fontSize: fontSizes.body1
  // };

  // const inputStyle = {
  //   backgroundColor: 'white',
  //   borderRadius: '2px',
  //   '& .MuiInputBase-input': {
  //     color: '#DE3831',
  //     fontFamily: "Sansation Light",
  //     fontWeight: "bolder"
  //   },
  //   '& .MuiOutlinedInput-root': {
  //     borderRadius: '2px'
  //   }
  // };

  const handleAuthToggle = (_, newAuthMode) => {
    if (newAuthMode !== null) setAuthMode(newAuthMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={5} bgcolor="#FFB612" position="relative">
      <ToggleButtonGroup
        value={authMode}
        exclusive
        onChange={handleAuthToggle}
        sx={{ mb: 4 }}
      >
        <ToggleButton value="login" sx={{ fontFamily: "Sansation Light", fontSize: fontSizes.body1 }}>
          <AccountCircle sx={{ mr: 1 }} /> Login
        </ToggleButton>
        <ToggleButton value="signup" sx={{ fontFamily: "Sansation Light", fontSize: fontSizes.body1 }}>
          <PersonAdd sx={{ mr: 1 }} /> Register
        </ToggleButton>
      </ToggleButtonGroup>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"

        sx={{
          backgroundColor: '#FFB612',
          width: '90%',
          maxWidth: '700px',
          height: '400px',
          borderRadius: 2,
          position: "relative",
          padding: '20px',
        }}
      >
        {authMode === "login" ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3} textAlign="center" width="100%">
            <Typography variant="h6" sx={{ fontFamily: "Sansation Light", fontSize: fontSizes.h6, color: 'black', mb: 3 }}>SET SOME GOALS</Typography>
            <Typography variant="h6" sx={{ fontFamily: "Sansation Light", fontSize: fontSizes.h6, color: 'black', mb: 4 }}>THEN DEMOLISH THEM</Typography>

            <Box width="100%" textAlign="center" maxWidth="400px">
              <TextField
                fullWidth
                margin="normal"
                placeholder="Email Address"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light", mb: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1 }} />
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                sx={{ fontFamily: "Sansation Light", mb: 3 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button fullWidth variant="contained" sx={{ backgroundColor: 'black', fontFamily: "Sansation Light", mt: 2 }}>
                LOGIN
              </Button>
              <Typography variant="body2" sx={{ cursor: 'pointer', fontFamily: "Sansation Light", mt: 2, color: 'black', fontWeight: 'bold' }}>
                FORGOT PASSWORD?
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3} mt={5} textAlign="center" width="100%">
            <Typography variant="h6" mb={3} sx={{ fontFamily: "Sansation Light", fontSize: fontSizes.h6, color: 'black' }}>SIGN UP</Typography>

            <Box width="100%" textAlign="center" maxWidth="400px">
              <TextField
                fullWidth
                margin="normal"
                placeholder="First Name"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light", mb: 2 }}
                InputProps={{
                  startAdornment: <AccountCircle sx={{ mr: 1 }} />
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                placeholder="Last Name"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light", mb: 2 }}
                InputProps={{
                  startAdornment: <AccountCircle sx={{ mr: 1 }} />
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                placeholder="Email Address"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light", mb: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1 }} />
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                placeholder="Password"
                type="password"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light", mb: 3 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1 }} />
                }}
              />
              <Button fullWidth variant="contained" sx={{ backgroundColor: 'black', fontFamily: "Sansation Light", mt: 2 }}>
                SIGN UP
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      {/* <Box
              component="img"
              src={footerImage} // Replace with actual image path or URL
              alt="Graduates"
              sx={{ width: '100%', height: 'auto', mb: 1 }}
            />
            <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black' }}>
              <Typography variant="caption" sx={{ color: 'white', fontFamily: 'Sansation Light, sans-serif', fontSize: fontSizes.caption }}>
                Developed by Uchakide.co.za
              </Typography>
            </Box> */}
    </Box>
    
  );
};

export default LoginSignup;
