import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@mui/material";
import {
  Home,
  Assessment,
  ExpandLess,
  ExpandMore
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BalanceIcon from '@mui/icons-material/Balance';
import PaymentsIcon from '@mui/icons-material/Payments';
import ActivityLogsIcon from '@mui/icons-material/History';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ThemeContext } from "../config/ThemeContext";

const SideNavMenu = ({ open }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const menuItems = useMemo(() => {
    return user?.user_type === "admin"
      ? [
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
              { text: "Activity Logs", path: "/reports/activity-logs", icon: <ActivityLogsIcon /> },
            ],
          },
          { text: "User Information", path: "/user-info", icon: <AdminPanelSettingsIcon /> },
        ]
      : [
          { text: "Student Details", path: "/student-details", icon: <SchoolIcon /> },
          { text: "User Information", path: "/user-info", icon: <AdminPanelSettingsIcon /> },
        ];
  }, [user]);

  useEffect(() => {
    const reportPaths = menuItems[2]?.subItems?.map((item) => item.path) || [];
    if (reportPaths.some((path) => location.pathname.startsWith(path))) {
      setOpenDropdown(true);
    } else {
      setOpenDropdown(false);
    }
  }, [location, menuItems]);

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
          top: 64,
          position: "fixed",
          backgroundColor: isDarkMode ? "#1E293B" : "#F7FAFC",
          color: isDarkMode ? "#fff" : "#000",
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.subItems ? (
              <>
                <ListItemButton
                  onClick={() => setOpenDropdown(!openDropdown)}
                  sx={{
                    borderRadius: 2,
                    margin: "5px",
                    color: isDarkMode ? "#fff" : "#000",
                  }}
                >
                  <ListItemIcon sx={{ color: isDarkMode ? "#fff" : "#000" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openDropdown ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openDropdown} timeout="auto" unmountOnExit>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      component={Link}
                      to={subItem.path}
                      sx={{
                        backgroundColor:
                          location.pathname === subItem.path
                            ? isDarkMode
                              ? "#475569"
                              : "#CBD5E1"
                            : "transparent",
                        color:
                          location.pathname === subItem.path
                            ? isDarkMode
                              ? "#fff"
                              : "#000"
                            : isDarkMode
                            ? "#B0B0B0"
                            : "#000",
                        pl: 2,
                        borderRadius: 2,
                        fontWeight:
                          location.pathname === subItem.path
                            ? "bold"
                            : "normal",
                        "&:hover": {
                          backgroundColor: isDarkMode ? "#64748B" : "#E2E8F0",
                        },
                        margin: "3px",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            location.pathname === subItem.path
                              ? isDarkMode
                                ? "#fff"
                                : "#000"
                              : isDarkMode
                              ? "#B0B0B0"
                              : "#000",
                        }}
                      >
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </Collapse>
              </>
            ) : (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor:
                    location.pathname === item.path
                      ? isDarkMode
                        ? "#475569"
                        : "#CBD5E1"
                      : "transparent",
                  color:
                    location.pathname === item.path
                      ? isDarkMode
                        ? "#fff"
                        : "#000"
                      : isDarkMode
                      ? "#B0B0B0"
                      : "#000",
                  borderRadius: 2,
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#64748B" : "#E2E8F0",
                  },
                  margin: "5px",
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? isDarkMode
                          ? "#fff"
                          : "#000"
                        : isDarkMode
                        ? "#B0B0B0"
                        : "#000",
                  }}
                >
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
