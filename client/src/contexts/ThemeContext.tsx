import React, { useEffect, useState, useContext, ReactNode } from "react";

const ThemeContext = React.createContext<any>(undefined);
export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(localStorage.getItem("chat-theme") || "light");
  }, []);

  useEffect(() => {
    const root = document.querySelector(":root");
    if (root) {
      root.className = "";
      root.classList.add(theme);
      localStorage.setItem("chat-theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
