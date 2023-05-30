import { useContext } from "react";
import { SettingsStoreContext } from "../common/SettingsStoreProvider";

export function useSettingsStore() {
  return useContext(SettingsStoreContext);
}
