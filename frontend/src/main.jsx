import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MantineProvider defaultColorScheme="light">
          <App />
          <ToastContainer position="bottom-center" limit={1} autoClose={5000} />
        </MantineProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
