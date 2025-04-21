import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const WebNavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);  // For dropdown menu
  const location = useLocation(); // To highlight current route
  const [user, setUser] = useState(null);  // Store user data
  const [token, setToken] = useState(null);  // Store the token

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);  // Reset user data
    setToken(null);  // Reset token
    window.location.href = "/";  // Redirect to home or login page
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);  // Open the dropdown menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null);  // Close the dropdown menu
  };

  // Function to determine button text color based on current page
  const getButtonTextColor = (path) => {
    switch (path) {
      case '/':
        return 'black'; // Home
      case '/about-us':
        return 'white'; // About Us
      case '/contact-us':
        return 'white'; // Contact Us
      case '/eligibility':
        return 'black'; // Eligibility
      case '/popia':
        return 'white'; // POPIA
      case '/logreg':
        return 'black';  
      default:
        return 'black';
    }
  };

  const getButtonTextbgColor = (path) => {
    switch (path) {
      case '/':
        return '#FFB612'; // Home
      case '/about-us':
        return '#007A4D'; // About Us
      case '/contact-us':
        return '#002395'; // Contact Us
      case '/eligibility':
        return '#FFFFFF'; // Eligibility
      case '/popia':
        return '#000000'; // POPIA
      case '/logreg':  
        return '#FFB612';
      default:
        return '#FFB612';  
    }
  };

  const navItems = (
    <>
      <Button
        sx={{
          fontFamily: 'Sansation Light, sans-serif',
          color: getButtonTextColor(location.pathname),
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
        }}
        component={Link}
        to="/about-us"
      >
        About
      </Button>
      <Button
        sx={{
          fontFamily: 'Sansation Light, sans-serif',
          color: getButtonTextColor(location.pathname),
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
        }}
        component={Link}
        to="/eligibility"
      >
        Eligibility
      </Button>
      <Button
        sx={{
          fontFamily: 'Sansation Light, sans-serif',
          color: getButtonTextColor(location.pathname),
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
        }}
        component={Link}
        to="/popia"
      >
        POPIA
      </Button>
      <Button
        sx={{
          fontFamily: 'Sansation Light, sans-serif',
          color: getButtonTextColor(location.pathname),
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
        }}
        component={Link}
        to="/contact-us"
      >
        Contact Us
      </Button>
      {!token && (  // If the user is not logged in, show Login/Register button
        <Button
          sx={{
            color: getButtonTextColor(location.pathname),
            backgroundColor: 'transparent',
            border: '2px solid '+getButtonTextColor(location.pathname),
            padding: '6px 12px',
            borderRadius: '2px',
            fontFamily: 'Sansation Light, sans-serif',
            ml: 2,
            '&:hover': {
              backgroundColor: getButtonTextColor(location.pathname),
              borderColor: getButtonTextbgColor(location.pathname),
              color: getButtonTextbgColor(location.pathname),
            },
          }}
          component={Link}
          to="/login-register"
        >
          Login/Register
        </Button>
      )}
      {token && (  // If the user is logged in, show the user icon with a dropdown
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleMenuClick} sx={{ color: 'black' }}>
            <Avatar sx={{ bgcolor: '#FFB612' }}>{user.first_name.charAt(0)}</Avatar>
          </IconButton>
          <Typography sx={{ color: 'black', fontFamily: 'Sansation Light', fontWeight: 'bold', ml: 1 }}>
            {user.first_name}
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
              <AccountCircleIcon sx={{ mr: 1 }} /> Dashboard
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToAppIcon sx={{ mr: 1 }} /> Log Out
            </MenuItem>
          </Menu>
        </Box>
      )}
    </>
  );

  const drawerItems = [
    { text: 'Home', link: '/' },
    { text: 'About', link: '/about-us' },
    { text: 'Eligibility', link: '/eligibility' },
    { text: 'POPIA', link: '/popia' },
    { text: 'Contact Us', link: '/contact-us' },
    { text: 'Login/Register', link: '/login-register' },
  ];

  return (
    <AppBar position="relative" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Toolbar>
        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left side: Hamburger + WillowTon */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Hamburger (only on XS) */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => toggleDrawer(true)}
              sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1 ,color: getButtonTextColor(location.pathname) }}
            >
              <MenuIcon />
            </IconButton>

            {/* WillowTon text (now clickable to go to home page) */}
            <Typography
              variant="h6"
              component={Link}  // Make it clickable using Link component
              to="/"  // Link to the home page
              sx={{
                color: getButtonTextColor(location.pathname),
                fontWeight: 600,
                display: 'block',
                fontFamily: 'Sansation Light, sans-serif',
                textDecoration: 'none', // Remove underline from link
                cursor: 'pointer', // Change cursor to pointer for better UX
              }}
            >
              WillowTon
            </Typography>
          </Box>

          {/* Nav items on desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, alignItems: 'center' }}>
            {navItems}
          </Box>
        </Container>
      </Toolbar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box
          sx={{ width: 250, padding: 2 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ mb: 2,fontFamily: 'Sansation Light, sans-serif'  }}>
            WillowTon
          </Typography>
          <Divider />
          <List>
            {drawerItems.map(({ text, link }) => {
              const isSelected = location.pathname === link;
              return (
                <ListItem
                  button
                  key={text}
                  component={Link}
                  to={link}
                  sx={{
                    color: isSelected ? '#2d3748' : 'black',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    fontSize: isSelected ? '1rem' : '0.8rem',
                  }}
                >
                  <ListItemText
                    primary={<Typography sx={{ color: 'black', fontSize: '0.9rem', fontFamily: 'Sansation Light, sans-serif', fontWeight: isSelected ? 'bold' : 'normal' }}>{text}</Typography>}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default WebNavBar;
