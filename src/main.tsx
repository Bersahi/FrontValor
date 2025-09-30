import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Theme } from "@radix-ui/themes";
// Asegúrate de importar los estilos en este orden
import "@radix-ui/themes/styles.css";
import "./index.css";

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="blue">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Theme>
  </React.StrictMode>
);