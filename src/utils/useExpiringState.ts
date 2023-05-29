import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";

export function useExpiringState<S>(
  initialState: S | (() => S),
  minTimeoutMills: number
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(initialState);
  const initialStateRef = useRef(initialState);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setState(initialStateRef.current);
    }, minTimeoutMills);
    return () => {
      clearTimeout(timeout);
    };
  }, [minTimeoutMills]);

  return [state, setState];
}
