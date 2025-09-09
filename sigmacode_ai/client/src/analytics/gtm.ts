/*
  Google Tag Manager Initializer
  - Respektiert Do-Not-Track
  - Aktiviert nur in production, wenn VITE_ANALYTICS_ENABLED === 'true' und VITE_GTM_ID gesetzt ist
  - Optionales Debug-Logging via VITE_ANALYTICS_DEBUG === 'true'
*/

function isDoNotTrackEnabled(): boolean {
  // Various DNT signals across browsers
  // @ts-ignore
  const dnt = navigator.doNotTrack || window.doNotTrack || (navigator as any).msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
}

function logDebug(...args: unknown[]) {
  if (import.meta.env.VITE_ANALYTICS_DEBUG === 'true') {
    // eslint-disable-next-line no-console
    console.debug('[Analytics]', ...args);
  }
}

export function initAnalytics() {
  try {
    if (import.meta.env.MODE !== 'production') {
      logDebug('Skip analytics: not production (mode=', import.meta.env.MODE, ')');
      return;
    }

    if (isDoNotTrackEnabled()) {
      logDebug('Skip analytics: Do Not Track enabled');
      return;
    }

    if (import.meta.env.VITE_ANALYTICS_ENABLED !== 'true') {
      logDebug('Skip analytics: VITE_ANALYTICS_ENABLED != true');
      return;
    }

    const gtmId = import.meta.env.VITE_GTM_ID;
    if (!gtmId) {
      logDebug('Skip analytics: VITE_GTM_ID not set');
      return;
    }

    // Avoid double-initialization
    if ((window as any).dataLayer) {
      logDebug('GTM already initialized');
      return;
    }

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    script.onload = () => logDebug('GTM script loaded');
    script.onerror = () => logDebug('GTM script failed to load');

    document.head.appendChild(script);

    logDebug('GTM init requested for', gtmId);
  } catch (e) {
    logDebug('Analytics init error', e);
  }
}

export function track(eventName: string, payload?: Record<string, unknown>) {
  try {
    const dl = (window as any).dataLayer;
    if (!dl) {
      logDebug('track() called before GTM init', eventName, payload);
      return;
    }
    dl.push({ event: eventName, ...payload });
    logDebug('track()', eventName, payload);
  } catch (e) {
    logDebug('track() error', e);
  }
}
