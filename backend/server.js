// backend/server.js
const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes"); 
const studentRoutesother = require("./routes/studentRoutes_other"); 
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
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use the student routes
app.use("/api", studentRoutes); 
app.use("/api", studentRoutesother);
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
