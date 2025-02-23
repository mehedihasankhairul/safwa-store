"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useMemo } from "react";
import { PaletteMode } from "@mui/material";

export default function ThemeRegistry({ children }) {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
          secondary: { main: "#ff4081" },
          background: { default: mode === "light" ? "#f4f6f8" : "#121212" },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children({ toggleTheme })}
    </ThemeProvider>
  );
}
