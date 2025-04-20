import React, { createContext, useContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { theme as defaultTheme } from "./theme";

// Create a Context to manage font size dynamically
const FontSizeContext = createContext();

export const useFontSize = () => {
  return useContext(FontSizeContext);
};

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState("small"); // default font size

  // Function to adjust font size dynamically
  const setFontSizeHandler = (size) => {
    setFontSize(size);
  };

  // Dynamically create a theme based on the selected font size
  const theme = createTheme({
    ...defaultTheme,
    typography: {
      ...defaultTheme.typography,
      h1: {
        fontSize: fontSize === "large" ? "3rem" : fontSize === "small" ? "2rem" : "2.5rem",
      },
      h2: {
        fontSize: fontSize === "large" ? "2.5rem" : fontSize === "small" ? "1.75rem" : "2rem",
      },
      h3: {
        fontSize: fontSize === "large" ? "2rem" : fontSize === "small" ? "1.5rem" : "1.75rem",
      },
      h4: {
        fontSize: fontSize === "large" ? "1.75rem" : fontSize === "small" ? "1.25rem" : "1.5rem",
      },
      h5: {
        fontSize: fontSize === "large" ? "1.5rem" : fontSize === "small" ? "1.1rem" : "1.25rem",
      },
      h6: {
        fontSize: fontSize === "large" ? "1.25rem" : fontSize === "small" ? "1rem" : "1.1rem",
      },
      body1: {
        fontSize: fontSize === "large" ? "1.2rem" : fontSize === "small" ? "0.75rem" : "1rem",
      },
      body2: {
        fontSize: fontSize === "large" ? "1.1rem" : fontSize === "small" ? "0.75rem" : "0.875rem",
      },
      subtitle1: {
        fontSize: fontSize === "large" ? "1.1rem" : fontSize === "small" ? "0.85rem" : "1rem",
      },
      subtitle2: {
        fontSize: fontSize === "large" ? "1rem" : fontSize === "small" ? "0.8rem" : "0.875rem",
      },
      button: {
        fontSize: fontSize === "large" ? "1rem" : fontSize === "small" ? "0.75rem" : "0.8rem",
      },
      caption: {
        fontSize: fontSize === "large" ? "0.9rem" : fontSize === "small" ? "0.7rem" : "0.75rem",
      },
      overline: {
        fontSize: fontSize === "large" ? "0.85rem" : fontSize === "small" ? "0.65rem" : "0.7rem",
      },
    },
  });

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize: setFontSizeHandler }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </FontSizeContext.Provider>
  );
};
