import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./popup/Popup.tsx";
import "./base.css";
import { SettingsStoreProvider } from "./common/SettingsStoreProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsStoreProvider>
      <Popup />
    </SettingsStoreProvider>
  </React.StrictMode>
);
