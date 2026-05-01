// ─── SIMPLE REACTIVE STORE ────────────────────────────────────
// Lightweight pub-sub so all screens stay in sync without Redux

const listeners = new Set();
let state = {
  history: [],        // { id, uri, prompt, model, elapsed, steps, aspectLabel, timestamp }
  models:  [],        // string[]
  hapticEnabled: false, // haptic feedback toggle
};

export function getState() {
  return state;
}

export function setState(partial) {
  state = { ...state, ...partial };
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ─── HISTORY HELPERS ──────────────────────────────────────────
export function addHistory(item) {
  const entry = { ...item, id: Date.now().toString() };
  setState({ history: [entry, ...state.history] });
  return entry;
}

export function clearHistory() {
  setState({ history: [] });
}