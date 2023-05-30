import React from "react";
import ReactDOM from "react-dom/client";
import Options from "./options/Options";
import { SettingsStoreProvider } from "./common/SettingsStoreProvider";
import "./base.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsStoreProvider>
      <Options />
    </SettingsStoreProvider>
  </React.StrictMode>
);
