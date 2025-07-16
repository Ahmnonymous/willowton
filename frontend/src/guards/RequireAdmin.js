// src/guards/RequireAdmin.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user || user.user_type !== "admin") {
    return <Navigate to="/login-register" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAdmin;
