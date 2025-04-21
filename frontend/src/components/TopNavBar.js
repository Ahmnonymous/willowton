import React, { useContext, useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person"; // User profile icon
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Sun icon
import ModeNightIcon from "@mui/icons-material/ModeNight"; // Moon icon
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Logout icon
import DashboardIcon from "@mui/icons-material/Home"; // Dashboard icon
import { ThemeContext } from "../config/ThemeContext"; // Import the ThemeContext

const TopNavBar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Use context for theme toggle
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const dropdownRef = useRef(null); // Reference for the dropdown menu

  // Fetch the logged-in user's first name from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.first_name); // Set the user's first name
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  // If the user is not logged in, don't render the TopNavBar
  if (!user) {
    return null; // Return nothing if the user is not logged in
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the dropdown menu
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName(""); // Reset user data
    window.location.href = "/"; // Redirect to home or login page
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isDarkMode ? "#1E293B" : "#F7FAFC", // Light background in light mode, dark in dark mode
        color: isDarkMode ? "#fff" : "#000", // Light text color in dark mode, dark text in light mode
        height: "64px", // Set the height of the navbar here
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left - Sidebar Toggle Button & Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" onClick={toggleSidebar} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: isDarkMode ? "#fff" : "#000" }}>
            Student Portal
          </Typography>
        </Box>

        {/* Right - Theme Toggle, User Profile */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Theme Toggle with Sun and Moon Icons */}
          <IconButton onClick={toggleTheme} sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            {isDarkMode ? (
              <>
                <WbSunnyIcon sx={{ color: isDarkMode ? "#fff" : "#000" }} />
                <Typography variant="body2" sx={{ color: isDarkMode ? "#fff" : "#000", ml: 1 }}>Light</Typography>
              </>
            ) : (
              <>
                <ModeNightIcon sx={{ color: isDarkMode ? "#fff" : "#000" }} />
                <Typography variant="body2" sx={{ color: isDarkMode ? "#fff" : "#000", ml: 1 }}>Dark</Typography>
              </>
            )}
          </IconButton>

          {/* User Profile with Dropdown */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: isDarkMode ? "#fff" : "#000", // User profile text color based on theme
            }}
            ref={dropdownRef}
            onClick={handleMenuClick}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: isDarkMode ? "#3f51b5" : "#fff", // Avatar background color based on theme
                color: isDarkMode ? "#fff" : "#000", // Avatar icon color based on theme
                mr: 1,
                boxShadow: isDarkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)", // Avatar shadow effect
              }}
            >
              <PersonIcon /> {/* Use a person icon for the user profile */}
            </Avatar>
            <Typography variant="body1" color="inherit">
              {userName || "User"} {/* Display the logged-in user's first name */}
            </Typography>
          </Box>

          {/* User Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            marginTop="5px"
            sx={{
              borderRadius: "0",  // Square corners for the dropdown
              // border: "2px solid black",  // Black border
              // width: "200px",
              // boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            }}
          >
            {/* Menu Items with Icons */}
            <MenuItem component="a" href="/" sx={{ padding: '10px', fontFamily: 'Sansation Light', marginTop:'-8px' }}>
              <DashboardIcon sx={{ mr: 1 }} /> Home
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ padding: '10px', fontFamily: 'Sansation Light', marginBottom:'-8px' }}>
              <ExitToAppIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
