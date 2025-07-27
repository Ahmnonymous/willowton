import React, { useState } from "react";
import { Box, Button, TextField, Typography, ToggleButtonGroup, ToggleButton, IconButton, InputAdornment, Dialog, DialogActions, DialogTitle, DialogContent, Link, FormControlLabel, Checkbox } from "@mui/material";
import { AccountCircle, Lock, PersonAdd, Email, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import footerImage from '../images/footer.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Whitelist of known valid email domains
const validDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "icloud.com",
  // Add more domains as needed
];

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
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  // Define font sizes as variables
  const fontSizes = {
    h4: '2.5rem',
    body1: '1.2rem',
    h6: '1.2rem',
    listItemText: '1.1rem',
    caption: '1rem',
  };
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  // Basic email format validation
  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if email domain exists via DNS MX record lookup
  const checkEmailDomainExists = async (email) => {
    const domain = email.split("@")[1];
    if (validDomains.includes(domain)) {
      console.log(`Skipping DNS check for whitelisted domain: ${domain}`);
      return true; // Bypass DNS check for known domains
    }
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const data = await response.json();
      console.log(`DNS Response for ${domain}:`, data); // Debug logging
      return data?.Answer && data.Answer.length > 0;
    } catch (error) {
      console.error(`DNS Lookup Error for ${domain}:`, error);
      return false; // Fallback to false on error
    }
  };

  const handleAuthToggle = (_, newAuthMode) => {
    if (newAuthMode !== null) setAuthMode(newAuthMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTermsChange = (e) => {
    setIsTermsAccepted(e.target.checked);
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
    setForgotPasswordError("");
  };

  const handleForgotPasswordSubmit = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      const users = response.data;
      const userExists = users.some(user => user.email_address === forgotPasswordEmail);

      if (!userExists) {
        setForgotPasswordError("Email does not exist.");
        setForgotPasswordSuccess("");
      } else {
        setForgotPasswordSuccess("Password reset email has been sent.");
        setForgotPasswordError("");
        setTimeout(() => setOpenForgotPassword(false), 3000);
      }
    } catch (error) {
      setForgotPasswordError(error.response?.data?.msg);
    }
  };

  const logActivity = async (userId, activityType) => {
    try {
      await axios.post(`${API_BASE_URL}/activity-log/insert`, {
        user_id: userId,
        activity_type: activityType,
      });
      console.log(`${activityType} activity logged for user ${userId}`);
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({ email: "", password: "" });

    let formValid = true;
    const newErrors = { email: "", password: "" };

    if (authMode === "signup") {
      if (!formData.email_address) {
        newErrors.email = "Email is required";
        formValid = false;
      } else if (!validateEmailFormat(formData.email_address)) {
        newErrors.email = "Invalid email format";
        formValid = false;
      } else {
        const domainExists = await checkEmailDomainExists(formData.email_address);
        if (!domainExists) {
          newErrors.email = "Email domain does not exist. Please enter a valid email.";
          formValid = false;
        }
      }

      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
        formValid = false;
      }

      if (!isTermsAccepted) {
        newErrors.terms = "You must agree to the Terms & Conditions and POPIA consent.";
        formValid = false;
      }
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }

    try {
      let response;
      if (authMode === "login") {
        response = await axios.post(`${API_BASE_URL}/login`, {
          email_address: formData.email_address,
          password: formData.password,
        });

        if (response.data.msg === "User not found") {
          setErrors({
            email: "User does not exist",
            password: "",
          });
          return;
        } else if (response.data.msg === "Incorrect password") {
          setErrors({
            email: "",
            password: "Incorrect password. Please try again.",
          });
          return;
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        await logActivity(response.data.user.user_id, "login");

        if (response.data.user.user_type === 'student') {
          window.location.href = "/student-details";
        } else if (response.data.user.user_type === 'admin') {
          window.location.href = "/dashboard";
        }
      } else {
        response = await axios.post(`${API_BASE_URL}/users`, formData);

        const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
          email_address: formData.email_address,
          password: formData.password,
        });

        localStorage.setItem("token", loginResponse.data.token);
        localStorage.setItem("user", JSON.stringify(loginResponse.data.user));

        await logActivity(loginResponse.data.user.user_id, "login");

        if (loginResponse.data.user.user_type === 'student') {
          window.location.href = "/student-details";
        } else if (loginResponse.data.user.user_type === 'admin') {
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      console.error("Error submitting form", error);
      const msg = error.response?.data?.msg?.toLowerCase();

      if (msg?.includes("password")) {
        setErrors({ email: "", password: error.response.data.msg });
      } else if (msg?.includes("email") || msg?.includes("user")) {
        setErrors({ email: error.response.data.msg, password: "" });
      } else {
        setErrors({ email: "", password: "" });
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      minHeight="100vh"
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
              <Typography variant="h6" sx={{ fontFamily: "Sansation Light", textAlign: 'center', fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, color: 'black', mb: 3 }}>
                SET SOME GOALS
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: "Sansation Light", textAlign: 'center', fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, color: 'black', mb: 3 }}>
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
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: 'black', fontFamily: "Sansation Light", mt: 1, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}>
                  LOGIN
                </Button>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer', fontFamily: "Sansation Light", mt: 2, color: 'black', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.8rem', md: '0.8rem' } }}
                  onClick={() => setOpenForgotPassword(true)}
                >
                  FORGOT PASSWORD?
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" mb={2} sx={{ fontFamily: "Sansation Light", textAlign: 'center', fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, color: 'black' }}>
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isTermsAccepted}
                      onChange={handleTermsChange}
                      sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                    />
                  }
                  label={
                    <Typography sx={{ fontFamily: "Sansation Light", fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, color: 'black', textAlign: 'left' }}>
                      By continuing, you agree to our Terms & Conditions and give consent in terms of the POPIA Act to process and store your personal information for service delivery purposes.
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />
                {errors.terms && (
                  <Typography color="error" sx={{ fontFamily: "Sansation Light", fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, mb: 2 }}>
                    {errors.terms}
                  </Typography>
                )}
                <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: 'black', fontFamily: "Sansation Light", mt: 1, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}>
                  REGISTER
                </Button>
              </Box>
            </>
          )}
        </form>
      </Box>

      <Dialog
        open={openForgotPassword}
        onClose={() => setOpenForgotPassword(false)}
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '300px',
            width: '100%',
            margin: 'auto',
            padding: '5px',
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: '5px 10px' }}>
            <Typography variant="h6">Forgot Password</Typography>
            <IconButton onClick={() => setOpenForgotPassword(false)}>
              ×
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: '0px 20px 0px 20px' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={forgotPasswordEmail}
            onChange={handleForgotPasswordChange}
            placeholder="Enter your email address"
            error={!!forgotPasswordError}
            helperText={forgotPasswordError || forgotPasswordSuccess}
            sx={{ marginBottom: '10px' }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '5px 20px 20px 20px' }}>
          <Button
            onClick={handleForgotPasswordSubmit}
            fullWidth
            variant="contained"
            sx={{ backgroundColor: 'black', fontFamily: "Sansation Light", padding: '10px' }}
          >
            Request Password
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        component="img"
        src={footerImage}
        alt="footer"
        sx={{ width: '100%', height: 'auto', mt: 'auto', mb: 1 }}
      />
      <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black' }}>
        <Typography
          variant="caption"
          sx={{
            color: 'black',
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
            sx={{ color: 'black' }}
          >
            uchakide.co.za
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginSignup;