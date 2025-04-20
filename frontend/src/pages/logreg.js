import React, { useState } from "react";
import { Box, Button, TextField, Typography, ToggleButtonGroup, ToggleButton, IconButton, InputAdornment } from "@mui/material";
import { AccountCircle, Lock, PersonAdd, Email, Visibility, VisibilityOff } from "@mui/icons-material";

const LoginSignup = () => {
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

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
        <ToggleButton value="login" sx={{ fontFamily: "Sansation Light", fontSize: '0.9rem' }}>
          <AccountCircle sx={{ mr: 1 }} /> Login
        </ToggleButton>
        <ToggleButton value="signup" sx={{ fontFamily: "Sansation Light", fontSize: '0.9rem' }}>
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
          position: "relative", // Relative positioning to contain the shapes
        }}
      >
        {authMode === "login" ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3} textAlign="center" width="100%">
            <Typography variant="h6" sx={{ fontFamily: "Sansation Light", fontSize: '3rem', color: 'black' }}>SET SOME GOALS</Typography>
            <Typography variant="h6" mb={3} sx={{ fontFamily: "Sansation Light", fontSize: '3rem', color: 'black' }}>THEN DEMOLISH THEM</Typography>
            <Box width="100%" textAlign="center" maxWidth="400px">
              <TextField
                fullWidth
                margin="normal"
                placeholder="Email Address"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light" }}
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
                sx={{ fontFamily: "Sansation Light" }}
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
              <Button fullWidth variant="contained" sx={{ backgroundColor: 'black', mt: 2, fontFamily: "Sansation Light" }}>LOGIN</Button>
              <Typography variant="body2" sx={{cursor: 'pointer', fontFamily: "Sansation Light", mt:2, color:'black', fontWeight: 'bold' }}>
                FORGOT PASSWORD?
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3} mt={5} textAlign="center" width="100%">
            <Typography variant="h6" mb={2} sx={{ fontFamily: "Sansation Light", fontSize: '3rem', color: 'black' }}>SIGN UP</Typography>
            <Box width="100%" textAlign="center" maxWidth="400px">
              <TextField
                fullWidth
                margin="normal"
                placeholder="First Name"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light" }}
                InputProps={{
                  startAdornment: <AccountCircle sx={{ mr: 1 }} />
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                placeholder="Last Name"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light" }}
                InputProps={{
                  startAdornment: <AccountCircle sx={{ mr: 1 }} />
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                placeholder="Email Address"
                variant="outlined"
                sx={{ fontFamily: "Sansation Light" }}
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
                sx={{ fontFamily: "Sansation Light" }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1 }} />
                }}
              />
              <Button fullWidth variant="contained" sx={{ backgroundColor: 'black', mt: 2, fontFamily: "Sansation Light" }}>SIGN UP</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LoginSignup;
