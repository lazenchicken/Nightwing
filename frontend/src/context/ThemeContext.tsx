import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'dark' as 'dark' });

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = 'dark';
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
