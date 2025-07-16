// src/guards/RequireAuth.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login-register" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
