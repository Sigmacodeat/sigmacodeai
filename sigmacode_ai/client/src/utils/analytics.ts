export type AnalyticsPayload = Record<string, unknown>;

/**
 * Leichter Analytics-Emitter. Entkoppelt UI-Texte von Event-IDs.
 * Verwendet ein CustomEvent, kann von Integrationen (GA, Rudder, etc.) aufgegriffen werden.
 */
export function trackEvent(id: string, payload?: AnalyticsPayload): void {
  if (typeof window === 'undefined') return;
  const detail = { id, ...(payload ?? {}) };
  window.dispatchEvent(new CustomEvent('analytics:event', { detail }));
  // Dev-Log nur außerhalb Production
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', id, detail);
  }
}
