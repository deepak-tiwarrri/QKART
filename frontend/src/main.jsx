import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Toaster } from "sonner";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MantineProvider defaultColorScheme="dark">
          <App />
          {/* Sonner — replaces react-toastify. Rich colors, themed to match dark palette */}
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "Inter, sans-serif",
                borderRadius: "12px",
              },
            }}
          />
        </MantineProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
