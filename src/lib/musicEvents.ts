// Simple event bus for coordinating music between components
type Listener = () => void;

const listeners: Record<string, Listener[]> = {};

export const musicEvents = {
  on(event: string, fn: Listener) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => {
      listeners[event] = listeners[event].filter((l) => l !== fn);
    };
  },
  emit(event: string) {
    listeners[event]?.forEach((fn) => fn());
  },
};
