import React, { createContext, useState, useMemo } from "react";

// Define themes
const lightTheme = {
  isDark: false,
  background: "#E3FDFD",
  text: "#000",
  primary: "#6A67CE",
  backgroundGradient: ["#E3FDFD", "#C9E9F8"],
};

const darkTheme = {
  isDark: true,
  background: "#1C1C1C",
  text: "#FFF",
  primary: "#6A67CE",
  backgroundGradient: ["#1C1C1C", "#333"],
};

// Create the context
export const ThemeContext = createContext();

// Create the provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.isDark ? lightTheme : darkTheme));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};