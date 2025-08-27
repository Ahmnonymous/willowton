// backend/server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");  // Import session
const allRoutes = require("./routes/allroutes"); 
const studentRoutes = require("./routes/studentRoutes"); 
const aboutMeRoutes = require("./routes/aboutmeroutes");
const parentsRoutes = require("./routes/parentsroutes");
const universitydetailsroutes = require("./routes/universitydetailsroutes");
const attachmentsroutes = require("./routes/attachmentsroutes");
const expensedetailsroutes = require("./routes/expensedetailsroutes");
const assetsliabilitiesroutes = require("./routes/assetsliabilitiesroutes");
const academicresultsroutes = require("./routes/academicresultsroutes");
const voluntaryserviceroutes = require("./routes/voluntaryserviceroutes");
const paymentroutes = require("./routes/paymentroutes");
const interviewroutes = require("./routes/interviewroutes");
const reportroutes = require("./routes/reportroutes");
const dashboardroutes = require("./routes/dashboardroutes");
const createadmin = require("./routes/createadmin");
const taskdetailsroutes = require("./routes/taskdetailsroutes");
const activitylogroutes = require("./routes/activitylogroutes");
const studentPDFroutes = require("./routes/studentPDFroutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,  // Replace this with a strong secret key
    resave: false,            // Don't save session if not modified
    saveUninitialized: true,  // Always create session for new users
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Use the student routes
app.use("/api", studentRoutes); 
app.use("/api", allRoutes);
app.use("/api", aboutMeRoutes);
app.use("/api", parentsRoutes);
app.use("/api", universitydetailsroutes);
app.use("/api", attachmentsroutes);
app.use("/api", expensedetailsroutes);
app.use("/api", assetsliabilitiesroutes);
app.use("/api", academicresultsroutes);
app.use("/api", voluntaryserviceroutes);
app.use("/api", paymentroutes);
app.use("/api", interviewroutes);
app.use("/api", reportroutes);
app.use("/api", dashboardroutes);
app.use("/api", createadmin);
app.use("/api", taskdetailsroutes);
app.use("/api", activitylogroutes);
app.use("/api", studentPDFroutes);
app.use("/api/images", express.static(path.join(process.cwd(), "public/images")));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
