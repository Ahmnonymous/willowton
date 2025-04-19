import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { FontSizeProvider } from "./config/FontSizeProvider";
import { ThemeProvider } from './config/ThemeContext';

// Import NavBars
import WebNavBar from "./components/WebNavBar";
import TopNavBar from "./components/TopNavBar";
import SideNavMenu from "./components/SideNavMenu";

// Import Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Eligibility from "./pages/Eligibility";
import POPIA from "./pages/POPIA";
import PageNotFound from "./pages/PageNotFound";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import StudentDetails from "./pages/StudentDetails";
import UserCreation from "./pages/CreateAdmin";

// Import Reports
import ParentReport from "./pages/reports/ParentReport";
import StudentEquity from "./pages/reports/StudentEquity";
import PaymentReport from "./pages/reports/PaymentReport";
import StudentReport from "./pages/reports/StudentReport";
import VoluntaryReport from "./pages/reports/VoluntaryReport";

// Page title updater component
const PageTitleUpdater = () => {
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    let title = "React App";
    let favicon = "/favicon-light.ico";

    if (path === "/") title = "Home";
    else if (path === "/about-us") title = "About Us";
    else if (path === "/contact-us") title = "Contact Us";
    else if (path === "/eligibility") title = "Eligibility";
    else if (path === "/popia") title = "POPIA";
    else if (path === "/dashboard") title = "Dashboard";
    else if (path === "/student-details") title = "Student Details";
    else if (path === "/create-admin") title = "Create Admin";
    else if (path === "/add-student") title = "Add Student";
    else if (path.startsWith("/reports")) {
      if (path === "/reports/parent-report") title = "Parent Report";
      else if (path === "/reports/student-equity") title = "Student Equity Report";
      else if (path === "/reports/payment-report") title = "Payment Report";
      else if (path === "/reports/student-report") title = "Student Report";
      else if (path === "/reports/voluntary-report") title = "Voluntary Report";
      else title = "Page Not Found";
    } else {
      // Fallback title for any unknown route
      title = "Page Not Found";
    }

    document.title = title;
    document.querySelector('link[rel="icon"]').href = favicon;
  }, [location]);

  return null;
};

// Layout handler to render layout conditionally
const LayoutHandler = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageBackgroundColors = {
    '/': '#FFB612',
    '/about-us': '#007A4D',
    '/contact-us': '#DE3831',
    '/eligibility': '#FFFFFF',
    '/popia': '#000000',
  };

  const pageBackgroundColor = pageBackgroundColors[location.pathname] || null;

  const isWebAppPage = location.pathname.startsWith("/dashboard") ||
                       location.pathname.startsWith("/add-student") ||
                       location.pathname.startsWith("/student-details") ||
                       location.pathname.startsWith("/create-admin");

  const isReportPage = location.pathname.startsWith("/reports");

  const validPaths = [
    "/", "/about-us", "/contact-us", "/eligibility", "/popia",
    "/dashboard", "/add-student", "/student-details", "/create-admin",
    "/reports/parent-report", "/reports/student-equity", "/reports/payment-report",
    "/reports/student-report", "/reports/voluntary-report"
  ];
  
  const isKnownRoute = validPaths.includes(location.pathname);
  const isWebPage = !isWebAppPage && !isReportPage && isKnownRoute;
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ThemeProvider pageBackgroundColor={pageBackgroundColor}>
      <CssBaseline />

      {/* Render navbars conditionally */}
      {isWebAppPage || isReportPage ? (
        <>
          <TopNavBar toggleSidebar={toggleSidebar} />
          <SideNavMenu open={sidebarOpen} />
        </>
      ) : isWebPage ? (
        <WebNavBar />
      ) : null}

      <Box
        component="main"
        sx={{
          mt: isWebAppPage ? 8 : 0,
          ml: sidebarOpen && isWebAppPage ? 30 : 0,
          transition: "margin 0.3s ease",
          p: isWebAppPage ? 3 : 0,
        }}
        className={isWebPage ? 'web-page' : ''}
      >
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/popia" element={<POPIA />} />

          {/* Admin Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/student-details" element={<StudentDetails />} />
          <Route path="/create-admin" element={<UserCreation />} />

          {/* Report Pages */}
          <Route path="/reports/parent-report" element={<ParentReport />} />
          <Route path="/reports/student-equity" element={<StudentEquity />} />
          <Route path="/reports/payment-report" element={<PaymentReport />} />
          <Route path="/reports/student-report" element={<StudentReport />} />
          <Route path="/reports/voluntary-report" element={<VoluntaryReport />} />

          {/* Page Not Found */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <Router>
          <PageTitleUpdater />
          <LayoutHandler />
        </Router>
      </FontSizeProvider>
    </ThemeProvider>
  );
};

export default App;
