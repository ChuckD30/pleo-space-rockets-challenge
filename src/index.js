import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, theme, ColorModeProvider, CSSReset } from "@chakra-ui/core";

import App from "./components/app";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <App />
        </ColorModeProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
