import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { FontSizeProvider } from "./config/FontSizeProvider";
import { ThemeProvider } from './config/ThemeContext';

// Normal component imports (UI chrome)
import WebNavBar from "./components/WebNavBar";
import TopNavBar from "./components/TopNavBar";
import SideNavMenu from "./components/SideNavMenu";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Eligibility = lazy(() => import("./pages/Eligibility"));
const POPIA = lazy(() => import("./pages/POPIA"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentDetails = lazy(() => import("./pages/StudentDetails"));
const UserCreation = lazy(() => import("./pages/CreateAdmin"));
const LogReg = lazy(() => import("./pages/logreg"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const SendEmail = lazy(() => import("./components/SendEmail"));

// Lazy-loaded reports
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

  const pageBackgroundColors = {
    '/': '#FFB612',
    '/about-us': '#007A4D',
    '/contact-us': '#DE3831',
    '/eligibility': '#FFFFFF',
    '/popia': '#000000',
    '/login-register': '#FFB612'
  };

  const pageBackgroundColor = pageBackgroundColors[location.pathname] || null;

  const isWebAppPage = location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/add-student") ||
    location.pathname.startsWith("/student-details") ||
    location.pathname.startsWith("/user-info") ||
    location.pathname.startsWith("/reports");

  const isReportPage = location.pathname.startsWith("/reports");

  const validPaths = [
    "/", "/about-us", "/contact-us", "/eligibility", "/popia",
    "/dashboard", "/add-student", "/student-details", "/user-info",
    "/reports/parent-report", "/reports/student-equity", "/reports/payment-report",
    "/reports/student-report", "/reports/voluntary-report", "/reports/activity-logs",
    "/login-register", "/send-email"
  ];

  const isKnownRoute = validPaths.includes(location.pathname);
  const isWebPage = !isWebAppPage && !isReportPage && isKnownRoute;

  const isLoggedIn = user !== null;
  const isAdmin = isLoggedIn && user.user_type === 'admin';
  const isStudent = isLoggedIn && user.user_type === 'student';

  const isAccessiblePage = () => {
    if (!isLoggedIn) {
      return ["/", "/about-us", "/contact-us", "/eligibility", "/popia", "/login-register", "/send-email"].includes(location.pathname);
    }
    if (isAdmin) return true;
    if (isStudent) {
      return validPaths.includes(location.pathname) && ![
        "/dashboard", "/add-student",
        "/reports/parent-report", "/reports/student-equity",
        "/reports/payment-report", "/reports/student-report",
        "/reports/voluntary-report", "/reports/activity-logs"
      ].includes(location.pathname);
    }
    return false;
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ThemeProvider pageBackgroundColor={pageBackgroundColor}>
      <CssBaseline />

      {isLoggedIn && (isAdmin || isStudent) && (isWebAppPage || isReportPage) ? (
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
          mt: (isLoggedIn && (isAdmin || isStudent)) && (isWebAppPage || isReportPage) && isAccessiblePage() ? 8 : 0,
          ml: sidebarOpen && (isWebAppPage || isReportPage) && (isAdmin || isStudent) && isAccessiblePage() ? 30 : 0,
          transition: "margin 0.3s ease",
          p: (isLoggedIn && (isAdmin || isStudent)) && (isWebAppPage || isReportPage) && isAccessiblePage() ? 3 : 0,
        }}
        className={isWebPage ? 'web-page' : ''}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/popia" element={<POPIA />} />
            <Route path="/login-register" element={<LogReg />} />
            <Route path="/send-email" element={<SendEmail />} />

            {isAdmin && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/student-details" element={<StudentDetails />} />
                <Route path="/user-info" element={<UserCreation />} />
                <Route path="/reports/parent-report" element={<ParentReport />} />
                <Route path="/reports/student-equity" element={<StudentEquity />} />
                <Route path="/reports/payment-report" element={<PaymentReport />} />
                <Route path="/reports/student-report" element={<StudentReport />} />
                <Route path="/reports/voluntary-report" element={<VoluntaryReport />} />
                <Route path="/reports/activity-logs" element={<ActivityReport />} />
              </>
            )}

            {isStudent && (
              <>
                <Route path="/student-details" element={<StudentDetails />} />
                <Route path="/user-info" element={<UserCreation />} />
              </>
            )}

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
