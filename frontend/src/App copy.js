import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { FontSizeProvider } from "./config/FontSizeProvider";
import { ThemeProvider } from './config/ThemeContext';

import TopNavBar from "./components/TopNavBar";
import SideNavMenu from "./components/SideNavMenu";

// Import your pages
import Home from "./pages/Home";  // Updated from Home.js
import AboutUs from "./pages/AboutUs";  // New About Us page
import ContactUs from "./pages/ContactUs";  // New Contact Us page
import Eligibility from "./pages/Eligibility";  // New Eligibility page
import POPIA from "./pages/POPIA";  // New POPIA page
import PageNotFound from "./pages/PageNotFound";  // Page not found for 404

// Other existing imports
import Dashboard from "./pages/Dashboard";  // Updated from Home.js
import AddStudent from "./pages/AddStudent";
import StudentDetails from "./pages/StudentDetails";
import UserCreation from "./pages/CreateAdmin";

// Import Reports
import ParentReport from "./pages/reports/ParentReport";
import StudentEquity from "./pages/reports/StudentEquity";
import PaymentReport from "./pages/reports/PaymentReport";
import StudentReport from "./pages/reports/StudentReport";
import VoluntaryReport from "./pages/reports/VoluntaryReport";

// Import Drawers
import StudentDetailDrawer from "./pages/Drawer/StudentDetailDrawer";

// Page title updater component
const PageTitleUpdater = () => {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;
    let title = "React App";
    let favicon = "/favicon-light.ico";  // Default favicon

    // Set title and favicon based on path
    if (path === "/") {
      title = "Dashboard";
      favicon = "/favicon-light.ico"; // Change favicon for Dashboard page
    } else if (path === "/add-student") {
      title = "Add Student";
      favicon = "/favicon-light.ico"; // Change favicon for Add Student page
    } else if (path === "/student-details") {
      title = "Student Details";
      favicon = "/favicon-light.ico"; // Change favicon for Student Details page
    } else if (path === "/create-admin") {
      title = "Create Admin";
      favicon = "/favicon-light.ico"; // Change favicon for Create Admin page
    } else if (path.startsWith("/reports")) {
      // Reports - Proper names for the report pages
      if (path === "/reports/parent-report") {
        title = "Parent Report";
      } else if (path === "/reports/student-equity") {
        title = "Student Equity Report";
      } else if (path === "/reports/payment-report") {
        title = "Payment Report";
      } else if (path === "/reports/student-report") {
        title = "Student Report";
      } else if (path === "/reports/voluntary-report") {
        title = "Voluntary Report";
      }
      favicon = "/favicon-light.ico"; // Change favicon for Reports pages
    } else if (path === "/about-us") {
      title = "About Us";
    } else if (path === "/contact-us") {
      title = "Contact Us";
    } else if (path === "/eligibility") {
      title = "Eligibility";
    } else if (path === "/popia") {
      title = "POPIA";
    }

    // Update the document title and favicon
    document.title = title;
    document.querySelector('link[rel="icon"]').href = favicon;
  }, [location]);

  return null;
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <FontSizeProvider>
        <Router>
          <CssBaseline />
          <TopNavBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <SideNavMenu open={sidebarOpen} />
          <PageTitleUpdater /> {/* Update the page title and favicon based on route */}
          <Box
            component="main"
            sx={{
              mt: 8,
              ml: sidebarOpen ? 30 : 0,
              transition: "margin 0.3s ease",
              p: 3,
            }}
          >
            <Routes>
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/student-details" element={<StudentDetails />} />
              <Route path="/create-admin" element={<UserCreation />} />
              <Route path="/reports/parent-report" element={<ParentReport />} />
              <Route path="/reports/student-equity" element={<StudentEquity />} />
              <Route path="/reports/payment-report" element={<PaymentReport />} />
              <Route path="/reports/student-report" element={<StudentReport />} />
              <Route path="/reports/voluntary-report" element={<VoluntaryReport />} />
              <Route path="/Drawer/StudentDetailDrawer" element={<StudentDetailDrawer />} />

              {/* New Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/eligibility" element={<Eligibility />} />
              <Route path="/popia" element={<POPIA />} />
              
              {/* Page Not Found */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Box>
        </Router>
      </FontSizeProvider>
    </ThemeProvider>
  );
};

export default App;
