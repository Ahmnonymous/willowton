import React, { useState } from "react";
import { Box, Button, TextField, Typography, ToggleButtonGroup, ToggleButton, IconButton, InputAdornment } from "@mui/material";
import { AccountCircle, Lock, PersonAdd, Email, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios"; // Import axios for making HTTP requests
import footerImage from '../images/footer.png';

const LoginSignup = () => {
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    password: "",
    user_type: "student",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleAuthToggle = (_, newAuthMode) => {
    if (newAuthMode !== null) setAuthMode(newAuthMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks only for "signup" mode
    let formValid = true;
    const newErrors = { email: "", password: "" };

    if (authMode === "signup") {
      // Email and password validation for Register (signup)
      if (!formData.email_address) {
        newErrors.email = "Email is required";
        formValid = false;
      }

      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
        formValid = false;
      }
    }

    if (!formValid) {
      setErrors(newErrors);
      return; // Stop submission if form is invalid
    }

    try {
      let response;
      if (authMode === "login") {
        // Send login request to backend
        response = await axios.post("https://willowtonbursary.co.za/api/login", {
          email_address: formData.email_address,
          password: formData.password,
        });

        if (response.data.msg === "User not found") {
          setErrors({
            email: "User does not exist",
            password: "",
          });
          return; // Stop further processing if user is not found
        }

        // Ensure both token and user data are stored in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data

        // Redirect user to profile or dashboard after login
        window.location.href = "/";  // Change to your desired redirect path

      } else {
        // Send signup request to backend
        response = await axios.post("https://willowtonbursary.co.za/api/users", formData);

        // Auto-login after successful registration
        const loginResponse = await axios.post("https://willowtonbursary.co.za/api/login", {
          email_address: formData.email_address,
          password: formData.password,
        });

        // Store token and user data from login
        localStorage.setItem("token", loginResponse.data.token);
        localStorage.setItem("user", JSON.stringify(loginResponse.data.user));

        // Redirect to dashboard or student details page based on user type
        if (loginResponse.data.user.user_type === 'student') {
          window.location.href = "/";  // Redirect to student details
        } else {
          window.location.href = "/";  // Redirect to dashboard
        }
      }
    } catch (error) {
      console.error("Error submitting form", error);

      if (error.response?.data?.msg === "Email address is already in use") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email address is already in use",
        }));
      } else {
        alert("Error: " + error.response?.data?.msg || "Something went wrong");
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={5}
      bgcolor="#FFB612"
      position="relative"
    >
      <ToggleButtonGroup
        value={authMode}
        exclusive
        onChange={handleAuthToggle}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <ToggleButton value="login" sx={{ fontFamily: "Sansation Light", fontSize: { xs: '0.8rem', sm: '0.8rem', md: '1rem' } }}>
          <AccountCircle sx={{ mr: 1 }} /> Login
        </ToggleButton>
        <ToggleButton value="signup" sx={{ fontFamily: "Sansation Light", fontSize: { xs: '0.8rem', sm: '0.8rem', md: '1rem' } }}>
          <PersonAdd sx={{ mr: 1 }} /> Register
        </ToggleButton>
      </ToggleButtonGroup>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
        sx={{
          backgroundColor: '#FFB612',
          width: '90%',
          maxWidth: '700px',
          height: 'auto',
          borderRadius: 2,
          position: "relative",
          padding: '20px',
        }}
      >
        <form onSubmit={handleSubmit}>
          {authMode === "login" ? (
            <>
              <Typography variant="h6" sx={{ fontFamily: "Sansation Light", textAlign: 'center' , fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, color: 'black', mb: 3 }}>
                SET SOME GOALS
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: "Sansation Light", textAlign: 'center' , fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, color: 'black', mb: 3 }}>
                THEN DEMOLISH THEM
              </Typography>

              <Box width="100%" textAlign="center" maxWidth="400px">
                <TextField
                  name="email_address"
                  fullWidth
                  margin="normal"
                  value={formData.email_address}
                  onChange={handleChange}
                  placeholder="Email Address"
                  variant="outlined"
                  sx={{ fontFamily: "Sansation Light", mb: 2, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1 }} />,
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  name="password"
                  fullWidth
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  variant="outlined"
                  sx={{ fontFamily: "Sansation Light", mb: 3, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}
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
                <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: 'black', fontFamily: "Sansation Light", mt: 1, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}>
                  LOGIN
                </Button>
                <Typography variant="body2" sx={{ cursor: 'pointer', fontFamily: "Sansation Light", mt: 2, color: 'black', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.8rem', md: '0.8rem' } }}>
                  FORGOT PASSWORD?
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" mb={2} sx={{ fontFamily: "Sansation Light", textAlign: 'center' ,fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, color: 'black' }}>
                REGISTER
              </Typography>

              <Box width="100%" textAlign="center" maxWidth="400px">
                <TextField
                  name="first_name"
                  fullWidth
                  margin="normal"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  variant="outlined"
                  sx={{ fontFamily: "Sansation Light", mb: 2, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}
                  InputProps={{
                    startAdornment: <AccountCircle sx={{ mr: 1 }} />,
                  }}
                />
                <TextField
                  name="last_name"
                  fullWidth
                  margin="normal"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  variant="outlined"
                  sx={{ fontFamily: "Sansation Light", mb: 2, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}
                  InputProps={{
                    startAdornment: <AccountCircle sx={{ mr: 1 }} />,
                  }}
                />
                <TextField
                  name="email_address"
                  fullWidth
                  margin="normal"
                  value={formData.email_address}
                  onChange={handleChange}
                  placeholder="Email Address"
                  variant="outlined"
                  sx={{ fontFamily: "Sansation Light", mb: 2, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1 }} />,
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  name="password"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  variant="outlined"
                  sx={{ fontFamily: "Sansation Light", mb: 3, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}
                  InputProps={{
                    startAdornment: <Lock sx={{ mr: 1 }} />,
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: 'black', fontFamily: "Sansation Light", mt: 1, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}>
                  REGISTER
                </Button>
              </Box>
            </>
          )}
        </form>
      </Box>

      <Box
        component="img"
        src={footerImage}
        alt="Graduates"
        sx={{ width: '100%', height: 'auto', mb: 1 }}
      />
      <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black' }}>
        <Typography variant="caption" sx={{ color: 'black', fontFamily: 'Sansation Light, sans-serif', fontSize: '1rem' }}>
          Developed by Uchakide.co.za
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginSignup;
