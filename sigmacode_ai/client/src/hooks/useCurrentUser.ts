import { useEffect, useMemo, useState } from 'react';

/**
 * useCurrentUser
 *
 * State-of-the-art, robuste Client-Hook zur Ermittlung des aktuellen Usernamens.
 * - SSR-sicher (greift erst im Browser auf Window/Storage/Cookies zu)
 * - Entkoppelt direkte Cookie-Zugriffe (kapselt Fallbacks)
 * - Synchronisiert zwischen Tabs via Storage-Event
 * - Einfach erweiterbar (z. B. API-/Session-Fetch)
 */
export function useCurrentUser() {
  const [username, setUsername] = useState<string | null>(null);

  // Zentrale Resolver-Strategie, leicht erweiterbar
  const resolveUsername = useMemo(
    () => () => {
      if (typeof window === 'undefined') return null;

      // 1) Optional: global injizierter User (z. B. durch SSR/App-Init)
      const injected = (window as any).__USER__?.username as string | undefined;
      if (injected && typeof injected === 'string' && injected.trim()) {
        return injected.trim();
      }

      // 2) LocalStorage (state-of-the-art, manipulationsärmer als Query-String, aber weiterhin Client)
      try {
        const ls = window.localStorage.getItem('username');
        if (ls && ls.trim()) return ls.trim();
      } catch {
        // ignore
      }

      // 3) Cookie-Fallback (kapselt direkten Zugriff; optional, falls vorhanden)
      try {
        const cookie = document.cookie || '';
        const match = cookie.split('; ').find((c) => c.startsWith('username='));
        if (match) {
          const value = decodeURIComponent(match.split('=')[1] ?? '').trim();
          if (value) return value;
        }
      } catch {
        // ignore
      }

      return null;
    },
    []
  );

  useEffect(() => {
    // Initial-Resolve im Browser
    setUsername(resolveUsername());

    // Sync über Tabs/Windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'username') {
        setUsername(resolveUsername());
      }
    };
    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, [resolveUsername]);

  return { username } as const;
}
