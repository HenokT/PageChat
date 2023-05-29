import { useContext } from "react";
import { SettingsStoreContext } from "../components/SettingsProvider";

export function useSettingsStore() {
  return useContext(SettingsStoreContext);
}
