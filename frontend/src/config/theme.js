import { createTheme } from "@mui/material/styles";

// Define your font sizes and typography styles in one place
const typography = {
  h1: {
    fontSize: "2rem", // 32px
    fontWeight: 500,
  },
  h2: {
    fontSize: "1.75rem", // 28px
    fontWeight: 500,
  },
  body1: {
    fontSize: "1rem", // 16px
    fontWeight: 400,
  },
  body2: {
    fontSize: "0.875rem", // 14px
    fontWeight: 400,
  },
  // You can add more typography styles for h3, h4, h5, h6, etc.
};

// Define your MUI theme configuration
export const theme = createTheme({
  typography,
  // You can add other theme customizations here
});

export const lightTheme = {
  background: "#F7FAFC",
  cardBackground: "#E1F5FE",
  text: "#212121",
  navbarBackground: "#2D3748",
  navbarText: "#FFFFFF",
};

export const darkTheme = {
  background: "#2D3748",
  cardBackground: "#424242",
  text: "#FFFFFF",
  navbarBackground: "#1E293B",
  navbarText: "#FFFFFF",
};
