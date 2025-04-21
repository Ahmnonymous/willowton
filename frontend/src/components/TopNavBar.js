import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person"; // User profile icon
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Sun icon
import ModeNightIcon from "@mui/icons-material/ModeNight"; // Moon icon
import { ThemeContext } from "../config/ThemeContext"; // Import the ThemeContext

const TopNavBar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Use context for theme toggle
  const [user, setUser] = useState(null); // To store the user data

  // Fetch the user data from localStorage when the component loads
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // Set the user data if it's available
    }
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isDarkMode ? "#1E293B" : "#F7FAFC", // Light background in light mode, dark in dark mode
        color: isDarkMode ? "#fff" : "#000", // Light text color in dark mode, dark text in light mode
        height: "64px",  // Set the height of the navbar here
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left - Sidebar Toggle Button & Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Hamburger (only on XS) */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
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

          {/* User Profile */}
          {user && (  // Display only if user is logged in
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: isDarkMode ? "#fff" : "#000", // User profile text color based on theme
              }}
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
                {user.first_name} {/* Display the user first name */}
              </Typography>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
