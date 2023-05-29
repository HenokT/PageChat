import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SettingsStoreProvider } from "./components/SettingsProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsStoreProvider>
      <App />
    </SettingsStoreProvider>
  </React.StrictMode>
);
