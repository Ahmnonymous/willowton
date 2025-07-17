import React, { useContext, useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Home";
import { ThemeContext } from "../config/ThemeContext";
import axios from "axios"; // Import axios

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const TopNavBar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch the logged-in user's first name from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.first_name);

      // Log login activity when the component mounts and user exists
      // logActivity(storedUser.user_id, "login");
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  // If the user is not logged in, don't render the TopNavBar
  if (!user) {
    return null;
  }

  // Function to log user activity
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // Log logout activity before clearing localStorage
    await logActivity(user.user_id, "logout");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName("");
    window.location.href = "/";
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isDarkMode ? "#1E293B" : "#F7FAFC",
        color: isDarkMode ? "#fff" : "#000",
        height: "64px",
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
          <IconButton onClick={toggleTheme} sx={{ mr: 2, display: "flex", alignItems: "center" }}>
            {isDarkMode ? (
              <>
                <WbSunnyIcon sx={{ color: isDarkMode ? "#fff" : "#000" }} />
                <Typography variant="body2" sx={{ color: isDarkMode ? "#fff" : "#000", ml: 1 }}>
                  Light
                </Typography>
              </>
            ) : (
              <>
                <ModeNightIcon sx={{ color: isDarkMode ? "#fff" : "#000" }} />
                <Typography variant="body2" sx={{ color: isDarkMode ? "#fff" : "#000", ml: 1 }}>
                  Dark
                </Typography>
              </>
            )}
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: isDarkMode ? "#fff" : "#000",
            }}
            ref={dropdownRef}
            onClick={handleMenuClick}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: isDarkMode ? "#3f51b5" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
                mr: 1,
                boxShadow: isDarkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <PersonIcon />
            </Avatar>
            <Typography variant="body1" color="inherit">
              {userName || "User"}
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              borderRadius: "0",
              marginTop: "10px",
            }}
          >
            <MenuItem component="a" href="/" sx={{ padding: "10px", fontFamily: "Sansation Light", marginTop: "-8px" }}>
              <DashboardIcon sx={{ mr: 1 }} /> Home
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{ padding: "10px", fontFamily: "Sansation Light", marginBottom: "-8px" }}
            >
              <ExitToAppIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;