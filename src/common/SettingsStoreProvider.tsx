import { createContext, useMemo } from "react";
import { StorageKeys } from "../utils/constants";
import { useStoredState } from "../utils/useStoredState";

export type ChatMode = "with-page" | "with-llm";

export interface Settings {
  openAIApiKey?: string;
  chatMode?: ChatMode;
}

export interface SettingsStore {
  loading: boolean;
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export const SettingsStoreContext = createContext<SettingsStore>({
  loading: false,
  settings: {
    openAIApiKey: undefined,
    chatMode: "with-llm",
  },
  setSettings: () => {
    throw new Error("setOpenAIApiKey not implemented");
  },
});

export function SettingsStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, settings, setSettings] = useStoredState<Settings>({
    storageKey: StorageKeys.SETTINGS,
    defaultValue: {},
    storageArea: "local",
    scope: "global",
  });

  const value = useMemo(
    () => ({ loading, settings, setSettings }),
    [loading, settings, setSettings]
  );

  return (
    <SettingsStoreContext.Provider value={value}>
      {children}
    </SettingsStoreContext.Provider>
  );
}
