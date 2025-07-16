import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { FontSizeProvider } from "./config/FontSizeProvider";
import { ThemeProvider } from "./config/ThemeContext";

// Auth Guard Components
import RequireAdmin from "./guards/RequireAdmin";
import RequireAuth from "./guards/RequireAuth";

// Import NavBars
import WebNavBar from "./components/WebNavBar";
import TopNavBar from "./components/TopNavBar";
import SideNavMenu from "./components/SideNavMenu";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Eligibility = lazy(() => import("./pages/Eligibility"));
const POPIA = lazy(() => import("./pages/POPIA"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentDetails = lazy(() => import("./pages/StudentDetails"));
const UserCreation = lazy(() => import("./pages/CreateAdmin"));
const LogReg = lazy(() => import("./pages/logreg"));
const SendEmail = lazy(() => import("./components/SendEmail"));

// Lazy-loaded report pages
const ParentReport = lazy(() => import("./pages/reports/ParentReport"));
const StudentEquity = lazy(() => import("./pages/reports/StudentEquity"));
const PaymentReport = lazy(() => import("./pages/reports/PaymentReport"));
const StudentReport = lazy(() => import("./pages/reports/StudentReport"));
const VoluntaryReport = lazy(() => import("./pages/reports/VoluntaryReport"));
const ActivityReport = lazy(() => import("./pages/reports/ActivityReport"));

// Page title updater component
const PageTitleUpdater = () => {
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    let title = "WillowTon";
    if (path === "/") title = "Home";
    else if (path === "/about-us") title = "About Us";
    else if (path === "/contact-us") title = "Contact Us";
    else if (path === "/eligibility") title = "Eligibility";
    else if (path === "/popia") title = "POPIA";
    else if (path === "/dashboard") title = "Dashboard";
    else if (path === "/student-details") title = "Student Details";
    else if (path === "/user-info") title = "User Information";
    else if (path === "/login-register") title = "Login/Register";
    else if (path === "/send-email") title = "Send Email";
    else if (path.startsWith("/reports")) {
      if (path === "/reports/parent-report") title = "Parent Report";
      else if (path === "/reports/student-equity") title = "Student Equity Report";
      else if (path === "/reports/payment-report") title = "Payment Report";
      else if (path === "/reports/student-report") title = "Student Report";
      else if (path === "/reports/voluntary-report") title = "Voluntary Report";
      else if (path === "/reports/activity-logs") title = "Activity Logs";
      else title = "Page Not Found";
    } else {
      title = "Page Not Found";
    }
    document.title = title;
  }, [location]);

  return null;
};

const LayoutHandler = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = !!user;
  const isAdmin = user?.user_type === "admin";
  const isStudent = user?.user_type === "student";

  const pageBackgroundColors = {
    "/": "#FFB612",
    "/about-us": "#007A4D",
    "/contact-us": "#DE3831",
    "/eligibility": "#FFFFFF",
    "/popia": "#000000",
    "/login-register": "#FFB612",
  };

  const pageBackgroundColor = pageBackgroundColors[location.pathname] || null;

  const isWebAppPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/add-student") ||
    location.pathname.startsWith("/student-details") ||
    location.pathname.startsWith("/user-info") ||
    location.pathname.startsWith("/reports");

  const isWebPage = !isWebAppPage && [
    "/", "/about-us", "/contact-us", "/eligibility", "/popia", "/login-register", "/send-email"
  ].includes(location.pathname);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ThemeProvider pageBackgroundColor={pageBackgroundColor}>
      <CssBaseline />
      {isLoggedIn && isWebAppPage ? (
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
          mt: isLoggedIn && isWebAppPage ? 8 : 0,
          ml: sidebarOpen && isWebAppPage ? 30 : 0,
          transition: "margin 0.3s ease",
          p: isLoggedIn && isWebAppPage ? 3 : 0,
        }}
        className={isWebPage ? "web-page" : ""}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/popia" element={<POPIA />} />
            <Route path="/login-register" element={<LogReg />} />
            <Route path="/send-email" element={<SendEmail />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
            <Route path="/student-details" element={<RequireAuth><StudentDetails /></RequireAuth>} />
            <Route path="/user-info" element={<RequireAuth><UserCreation /></RequireAuth>} />

            {/* Report Routes (Admin only) */}
            <Route path="/reports/parent-report" element={<RequireAdmin><ParentReport /></RequireAdmin>} />
            <Route path="/reports/student-equity" element={<RequireAdmin><StudentEquity /></RequireAdmin>} />
            <Route path="/reports/payment-report" element={<RequireAdmin><PaymentReport /></RequireAdmin>} />
            <Route path="/reports/student-report" element={<RequireAdmin><StudentReport /></RequireAdmin>} />
            <Route path="/reports/voluntary-report" element={<RequireAdmin><VoluntaryReport /></RequireAdmin>} />
            <Route path="/reports/activity-logs" element={<RequireAdmin><ActivityReport /></RequireAdmin>} />

            {/* Fallback */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
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
