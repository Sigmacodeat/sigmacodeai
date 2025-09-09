import { useEffect, useState } from 'react';

/**
 * useDebouncedValue
 * Verzögert die Aktualisierung eines Werts um die angegebene Dauer (ms).
 * Nützlich, um teure Berechnungen/Requests zu drosseln.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
