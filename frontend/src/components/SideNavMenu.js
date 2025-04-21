import React, { useState, useEffect, useMemo } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { Home, Assessment, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

// Import the new icons
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BalanceIcon from '@mui/icons-material/Balance';
import PaymentsIcon from '@mui/icons-material/Payments';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import SchoolIcon from '@mui/icons-material/School';  // For Student Details
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // For Create Admin
import { useContext } from 'react';
import { ThemeContext } from "../config/ThemeContext"; // Import the ThemeContext

const SideNavMenu = ({ open }) => {
  const { isDarkMode } = useContext(ThemeContext); // Use theme context for dark mode
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [user, setUser] = useState(null); // State for user data
  
  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);  // Set user data
  }, []);

  // Conditional menu items based on user type wrapped in useMemo
  const menuItems = useMemo(() => {
    return user?.user_type === "admin" ? [
      { text: "Dashboard", path: "/dashboard", icon: <Home /> },
      { text: "Student Details", path: "/student-details", icon: <SchoolIcon /> },
      {
        text: "Reports",
        icon: <Assessment />,
        subItems: [
          { text: "Student Report", path: "/reports/student-report", icon: <LocalLibraryIcon /> },
          { text: "Parents Report", path: "/reports/parent-report", icon: <FamilyRestroomIcon /> },
          { text: "Student Equity", path: "/reports/student-equity", icon: <BalanceIcon /> },
          { text: "Payment Report", path: "/reports/payment-report", icon: <PaymentsIcon /> },
          { text: "Voluntary Service", path: "/reports/voluntary-report", icon: <AssistWalkerIcon /> },
        ],
      },
      { text: "Create Admin", path: "/create-admin", icon: <AdminPanelSettingsIcon /> },
    ] : [
      { text: "Student Details", path: "/student-details", icon: <SchoolIcon /> },
      { text: "Create Admin", path: "/create-admin", icon: <AdminPanelSettingsIcon /> },
    ];
  }, [user]); // Dependency array, so menuItems only changes when the user data changes

  // Effect to open the dropdown when on a report page
  useEffect(() => {
    const reportPaths = menuItems[2]?.subItems?.map((item) => item.path) || []; // Extract report paths
    if (reportPaths.some((path) => location.pathname.startsWith(path))) {
      setOpenDropdown(true); // Open the dropdown if we are on a report page
    } else {
      setOpenDropdown(false); // Close if not on a report page
    }
  }, [location, menuItems]); // Re-run this effect when menuItems changes

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? 240 : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
          top: 64,  // Adjust the top value to match the height of your top navbar
          position: 'fixed',  // Keep it fixed so it doesn't overlap with the main content
          backgroundColor: isDarkMode ? "#1E293B" : "#F7FAFC", // Dynamic background based on theme
          color: isDarkMode ? "#fff" : "#000", // Dynamic text color based on theme
        },
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.subItems ? (
              <>
                <ListItemButton onClick={() => setOpenDropdown(!openDropdown)} sx={{ borderRadius: 2, margin: "5px", color: isDarkMode ? '#fff' : '#000' }}>
                  <ListItemIcon sx={{ color: isDarkMode ? '#fff' : '#000' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openDropdown ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openDropdown} timeout="auto" unmountOnExit>
                  {item.subItems.map((subItem, subIndex) => (
                    <ListItemButton
                      key={subIndex}
                      component={Link}
                      to={subItem.path}
                      sx={{
                        backgroundColor: location.pathname === subItem.path ? (isDarkMode ? "#475569" : "#CBD5E1") : "transparent",
                        color: location.pathname === subItem.path ? (isDarkMode ? "#fff" : "#000") : (isDarkMode ? "#B0B0B0" : "#000"),
                        pl: 2,
                        borderRadius: 2,
                        fontWeight: location.pathname === subItem.path ? "bold" : "normal", // Bold the selected item
                        "&:hover": { backgroundColor: isDarkMode ? "#64748B" : "#E2E8F0" },
                        margin: "3px",
                      }}
                    >
                      <ListItemIcon sx={{ color: location.pathname === subItem.path ? (isDarkMode ? "#fff" : "#000") : (isDarkMode ? "#B0B0B0" : "#000") }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </Collapse>
              </>
            ) : (
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor: location.pathname === item.path ? (isDarkMode ? "#475569" : "#CBD5E1") : "transparent",
                  color: location.pathname === item.path ? (isDarkMode ? "#fff" : "#000") : (isDarkMode ? "#B0B0B0" : "#000"),
                  borderRadius: 2,
                  fontWeight: location.pathname === item.path ? "bold" : "normal", // Bold the selected item
                  "&:hover": { backgroundColor: isDarkMode ? "#64748B" : "#E2E8F0" },
                  margin: "5px",
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? (isDarkMode ? "#fff" : "#000") : (isDarkMode ? "#B0B0B0" : "#000") }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default SideNavMenu;
