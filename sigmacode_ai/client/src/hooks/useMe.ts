import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

// Zod-Schema für die /api/me Antwort
const MeSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  username: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export type Me = z.infer<typeof MeSchema>;

/**
 * useMe: Robuste API-basierte User-Erkennung
 * - Nutzt AbortController gegen Race Conditions
 * - Zod-Validierung für Typsicherheit
 * - SessionStorage-Caching für schnelle Rehydration
 * - Fehlertolerant (fällt still zurück)
 */
export function useMe(endpoint: string = '/api/me') {
  const [data, setData] = useState<Me | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1) Versuche Session-Cache zu laden
    try {
      const cache = sessionStorage.getItem('me');
      if (cache) {
        const parsed = JSON.parse(cache);
        const safe = MeSchema.safeParse(parsed);
        if (safe.success) {
          setData(safe.data);
          setLoading(false);
        }
      }
    } catch {
      // ignore cache errors
    }

    // 2) Netzwerkanfrage
    setLoading(true);
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    fetch(endpoint, { credentials: 'include', signal: ctrl.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const safe = MeSchema.safeParse(json);
        if (safe.success) {
          setData(safe.data);
          try {
            sessionStorage.setItem('me', JSON.stringify(safe.data));
          } catch {
            // ignore storage errors
          }
        } else {
          throw new Error('Invalid response shape');
        }
      })
      .catch((err) => {
        if (ctrl.signal.aborted) return; // Abbruch ist ok
        setError(err);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [endpoint]);

  return { data, loading, error } as const;
}
