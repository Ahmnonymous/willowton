import React, { useContext } from "react";
import { Typography, Box } from "@mui/material";
import { ThemeContext } from '../config/ThemeContext'; // Import ThemeContext

const Breadcrumb = ({ title }) => {
  // Move the useContext inside the component
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Box sx={{ padding: "12px", backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', borderRadius: "8px", marginBottom: "12px", border: '1px solid #ccc' }}>
      <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : 'black',fontWeight: "bold"}}>
        {title}
      </Typography>
    </Box>
  );
};

export default Breadcrumb;
