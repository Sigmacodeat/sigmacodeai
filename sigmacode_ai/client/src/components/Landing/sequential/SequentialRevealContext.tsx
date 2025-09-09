import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type SequentialRevealContextType = {
  lastRevealedIndex: number;
  canStart: (index: number, meetsViewport: boolean) => boolean;
  markRevealed: (index: number) => void;
  reset: () => void;
};

const SequentialRevealContext = createContext<SequentialRevealContextType | null>(null);

export function SequentialRevealProvider({ children, revealCooldownMs = 300, lookahead = 3 }: { children: React.ReactNode; revealCooldownMs?: number; lookahead?: number }) {
  const [lastRevealedIndex, setLastRevealedIndex] = useState(-1);
  const lastRevealAtRef = useRef<number>(0);

  const canStart = useCallback(
    (index: number, meetsViewport: boolean) => {
      if (!meetsViewport) return false;
      // Erlaube ein kleines Lookahead-Fenster, um Hänger zu vermeiden
      if (index > lastRevealedIndex + 1 + lookahead) return false;
      const now = performance.now();
      const elapsed = now - lastRevealAtRef.current;
      const ok = elapsed >= revealCooldownMs;
      if (typeof window !== 'undefined' && (window as any).SEQ_DEBUG) {
        // eslint-disable-next-line no-console
        console.debug('[Sequential] canStart(', index, ') ->', ok, {
          meetsViewport,
          expectedIndex: lastRevealedIndex + 1,
          lookahead,
          lastRevealedIndex,
          elapsed: Math.round(elapsed),
          revealCooldownMs,
        });
      }
      return ok;
    },
    [lastRevealedIndex, revealCooldownMs, lookahead]
  );

  const markRevealed = useCallback((index: number) => {
    if (typeof window !== 'undefined' && (window as any).SEQ_DEBUG) {
      // eslint-disable-next-line no-console
      console.debug('[Sequential] markRevealed(', index, ')');
    }
    setLastRevealedIndex((prev) => (index > prev ? index : prev));
    lastRevealAtRef.current = performance.now();
  }, []);

  const reset = useCallback(() => {
    setLastRevealedIndex(-1);
    lastRevealAtRef.current = 0;
  }, []);

  const value = useMemo(
    () => ({ lastRevealedIndex, canStart, markRevealed, reset }),
    [lastRevealedIndex, canStart, markRevealed, reset]
  );

  return <SequentialRevealContext.Provider value={value}>{children}</SequentialRevealContext.Provider>;
}

export function useSequentialReveal() {
  const ctx = useContext(SequentialRevealContext);
  if (!ctx) throw new Error('useSequentialReveal must be used within SequentialRevealProvider');
  return ctx;
}
