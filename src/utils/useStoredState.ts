import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Serializable = Record<string, any> | string | Serializable[];

export function useStoredState<T extends Serializable | undefined>({
  storageKey,
  storageArea = "session",
  scope = "page",
  defaultValue,
  debounceSaveByMills = 0,
}: {
  storageKey: string;
  storageArea?: "local" | "session";
  scope?: "page" | "global";
  /**
   * values passed after the initial render are ignored.
   */
  defaultValue: T;
  debounceSaveByMills?: number;
}): [boolean, T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(defaultValue);
  const defaultValueRef = useRef(defaultValue);
  const [loading, setLoading] = useState(true);
  const [absoluteStorageKey, setAbsoluteStorageKey] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    async function initializeAbsoluteStorageKey() {
      if (scope === "global") {
        setAbsoluteStorageKey(storageKey);
        return;
      }

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setAbsoluteStorageKey(`${tab.url}#${storageKey}`);
    }
    initializeAbsoluteStorageKey();
  }, [scope, storageKey]);

  useEffect(() => {
    let ignore = false;
    async function loadState() {
      if (!absoluteStorageKey) return;

      setLoading(true);

      try {
        const result = await chrome.storage[storageArea].get([
          absoluteStorageKey,
        ]);
        if (ignore) return;

        // console.log(`Loaded state:`, result);

        setState(result[absoluteStorageKey] ?? defaultValueRef.current);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadState();
    return () => {
      ignore = true;
    };
  }, [absoluteStorageKey, storageArea]);

  useEffect(() => {
    if (loading || !absoluteStorageKey) return;

    const timeoutID = setTimeout(async function saveState() {
      try {
        await chrome.storage[storageArea].set({
          [absoluteStorageKey]: state,
        });

        // console.log(`Saved state: `, {
        //   [absoluteStorageKey]: state,
        // });
      } catch (error) {
        console.error(error);
      }
    }, debounceSaveByMills);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [loading, absoluteStorageKey, state, storageArea, debounceSaveByMills]);

  return [loading, state, setState];
}
