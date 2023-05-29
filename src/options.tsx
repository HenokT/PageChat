import React from "react";
import ReactDOM from "react-dom/client";
import Options from "./components/Options";
import { SettingsStoreProvider } from "./components/SettingsProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsStoreProvider>
      <Options />
    </SettingsStoreProvider>
  </React.StrictMode>
);
