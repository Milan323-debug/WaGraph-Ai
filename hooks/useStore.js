import { useState, useEffect } from "react";
import { getState, subscribe } from "../store/appStore";

export function useStore() {
  const [state, setState] = useState(getState());

  useEffect(() => {
    const unsub = subscribe((next) => setState({ ...next }));
    return unsub;
  }, []);

  return state;
}