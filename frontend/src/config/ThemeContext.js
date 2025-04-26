// src/config/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from './theme';

// Create context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children, pageBackgroundColor }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load the theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);  // Store theme in localStorage
  };

  // Set the background color based on the page
  const getBackgroundColor = () => {
    if (pageBackgroundColor) return pageBackgroundColor;
    return isDarkMode ? darkTheme.background : lightTheme.background;
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div
        style={{
          backgroundColor: getBackgroundColor(),
          color: isDarkMode ? darkTheme.text : lightTheme.text,
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
