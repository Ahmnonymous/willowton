import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WillowTonLogo from "../images/willowton_logo.png";
import axios from "axios"; // Import axios

const WebNavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);

      // Log login activity when the component mounts and user exists
      // logActivity(storedUser.user_id, "login");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAnchorEl(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Function to log user activity
  const logActivity = async (userId, activityType) => {
    try {
      await axios.post("https://willowtonbursary.co.za/api/activity-log/insert", {
        user_id: userId,
        activity_type: activityType,
      });
      console.log(`${activityType} activity logged for user ${userId}`);
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    // Log logout activity before clearing localStorage
    if (user) {
      await logActivity(user.user_id, "logout");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    window.location.href = "/";
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getButtonTextColor = (path) => {
    switch (path) {
      case "/":
        return "black";
      case "/about-us":
        return "#007a4d";
      case "/contact-us":
        return "#de3831";
      case "/eligibility":
        return "black";
      case "/popia":
        return "white";
      case "/logreg":
        return "black";
      default:
        return "black";
    }
  };

  const getButtonTextbgColor = (path) => {
    switch (path) {
      case "/":
        return "#FFB612";
      case "/about-us":
        return "white";
      case "/contact-us":
        return "white";
      case "/eligibility":
        return "#FFFFFF";
      case "/popia":
        return "#000000";
      case "/logreg":
        return "#FFB612";
      default:
        return "#FFB612";
    }
  };

  const navItems = (
    <>
      <Button
        sx={{
          fontFamily: "Sansation Light, sans-serif",
          color: getButtonTextColor(location.pathname),
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
        }}
        component={Link}
        to="/about-us"
      >
        About
      </Button>
      <Button
        sx={{
          fontFamily: "Sansation Light, sans-serif",
          color: getButtonTextColor(location.pathname),
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
        }}
        component={Link}
        to="/eligibility"
      >
        Eligibility
      </Button>
      <Button
        sx={{
          fontFamily: "Sansation Light, sans-serif",
          color: getButtonTextColor(location.pathname),
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
        }}
        component={Link}
        to="/popia"
      >
        POPIA
      </Button>
      <Button
        sx={{
          fontFamily: "Sansation Light, sans-serif",
          color: getButtonTextColor(location.pathname),
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
        }}
        component={Link}
        to="/contact-us"
      >
        Contact Us
      </Button>
      {!token && (
        <Button
          sx={{
            color: getButtonTextColor(location.pathname),
            backgroundColor: "transparent",
            border: "2px solid " + getButtonTextColor(location.pathname),
            padding: "6px 12px",
            borderRadius: "2px",
            fontFamily: "Sansation Light, sans-serif",
            ml: 2,
            "&:hover": {
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
      {token && (
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} ref={dropdownRef} onClick={handleMenuClick}>
          <AccountCircleIcon sx={{ fontSize: 30, mr: 1, color: getButtonTextColor(location.pathname) }} />
          <Typography sx={{ color: getButtonTextColor(location.pathname), fontFamily: "Sansation Light", fontSize: "0.8rem" }}>
            {user?.first_name}
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              borderRadius: "0",
            }}
          >
            {user?.user_type === "student" ? (
              <MenuItem
                component={Link}
                to="/student-details"
                onClick={handleMenuClose}
                sx={{ color: "black", padding: "10px", fontFamily: "Sansation Light", marginTop: "-8px" }}
              >
                <AccountCircleIcon sx={{ mr: 1, color: "black" }} /> Student Details
              </MenuItem>
            ) : (
              <MenuItem
                component={Link}
                to="/dashboard"
                onClick={handleMenuClose}
                sx={{ color: "black", padding: "10px", fontFamily: "Sansation Light", marginTop: "-8px" }}
              >
                <AccountCircleIcon sx={{ mr: 1, color: "black" }} /> Dashboard
              </MenuItem>
            )}
            <MenuItem
              onClick={handleLogout}
              sx={{ padding: "10px", fontFamily: "Sansation Light", marginBottom: "-8px" }}
            >
              <ExitToAppIcon sx={{ mr: 1 }} /> Log Out
            </MenuItem>
          </Menu>
        </Box>
      )}
    </>
  );

  const drawerItems = [
    { text: "Home", link: "/" },
    { text: "About", link: "/about-us" },
    { text: "Eligibility", link: "/eligibility" },
    { text: "POPIA", link: "/popia" },
    { text: "Contact Us", link: "/contact-us" },
    ...(token
      ? [
          // Penalize: 0,
            user.user_type === "admin"
              ? { text: "Dashboard", link: "/dashboard" }
              : { text: "Student Details", link: "/student-details" },
          { text: "Log Out", link: "#", onClick: handleLogout },
        ]
      : [{ text: "Login/Register", link: "/login-register" }]
    ),
  ];

  return (
    <AppBar position="relative" sx={{ backgroundColor: getButtonTextbgColor(location.pathname), boxShadow: "none" }}>
      <Toolbar>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "none",
            "@media (min-width:1200px)": {
              maxWidth: "100%",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => toggleDrawer(true)}
              sx={{ display: { xs: "flex", sm: "none" }, mr: 1, color: getButtonTextColor(location.pathname) }}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/" style={{ textDecoration: "none" }}>
              <img src={WillowTonLogo} alt="WillowTon Logo" style={{ height: "40px", width: "auto" }} />
            </Link>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, alignItems: "center" }}>
            {navItems}
          </Box>
        </Container>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box
          sx={{ width: 250, padding: 2 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ mb: 2, fontFamily: "Sansation Light, sans-serif" }}>
            WillowTon
          </Typography>
          <Divider />
          <List>
            {drawerItems.map(({ text, link, onClick }) => {
              const isSelected = location.pathname === link;
              return (
                <ListItem
                  button
                  key={text}
                  component={Link}
                  to={link}
                  onClick={onClick}
                  sx={{
                    color: isSelected ? "#2d3748" : "black",
                    fontWeight: isSelected ? "bold" : "normal",
                    fontSize: isSelected ? "1rem" : "0.8rem",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: "0.9rem",
                          fontFamily: "Sansation Light, sans-serif",
                          fontWeight: isSelected ? "bold" : "normal",
                        }}
                      >
                        {text}
                      </Typography>
                    }
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