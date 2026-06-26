import { useState, useEffect } from "react";

const listeners = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | null = null;

function tick() {
  const currentNow = Date.now();
  listeners.forEach((listener) => listener());
}

export function useNow(updateInterval = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const listener = () => setNow(Date.now());
    listeners.add(listener);

    if (!interval) {
      interval = setInterval(tick, updateInterval);
    }

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, [updateInterval]);

  return now;
}
