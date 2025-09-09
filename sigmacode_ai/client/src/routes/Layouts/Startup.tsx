import { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import type { TStartupConfig } from 'librechat-data-provider';
import { useGetStartupConfig } from '~/data-provider';
import AuthLayout from '~/components/Auth/AuthLayout';
import { TranslationKeys, useLocalize } from '~/hooks';
import MarketingHeader from '~/components/marketing/MarketingHeader';

const headerMap: Record<string, TranslationKeys> = {
  '/login': 'com_auth_welcome_back',
  '/register': 'com_auth_create_account',
  '/forgot-password': 'com_auth_reset_password',
  '/reset-password': 'com_auth_reset_password',
  '/login/2fa': 'com_auth_verify_your_identity',
};

export default function StartupLayout({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [error, setError] = useState<TranslationKeys | null>(null);
  const [headerText, setHeaderText] = useState<TranslationKeys | null>(null);
  const [startupConfig, setStartupConfig] = useState<TStartupConfig | null>(null);
  // Router Hooks müssen vor ihrer Nutzung initialisiert werden
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  // Marketingpräfixe vor der Abfrage definieren, damit wir das Fetching ggf. deaktivieren können
  const marketingPrefixes = [
    '/ai-agents',
    '/ai-agents/mas',
    '/business-ai',
    '/how-it-works',
    '/pricing',
    '/referrals',
    '/providers',
  ];
  // Normalisiert Pfade für robuste Erkennung (entfernt Trailing Slash, ignoriert Hash/Query)
  const normalizePath = (path: string) => {
    const base = (path || '/').split('#')[0];
    const clean = base.endsWith('/') && base !== '/' ? base.slice(0, -1) : base;
    return clean || '/';
  };
  // Segment-bewusste Präfixprüfung: '/referrals' matcht, aber '/referrals-xyz' nicht
  const isMarketingPath = () => {
    const p = normalizePath(location.pathname);
    console.log('[DEBUG] isMarketingPath:', { pathname: location.pathname, normalized: p, marketingPrefixes, result: p === '/' || marketingPrefixes.some((prefix) => p === prefix || p.startsWith(prefix + '/')) });
    if (p === '/') return true;
    return marketingPrefixes.some((prefix) => p === prefix || p.startsWith(prefix + '/'));
  };

  const {
    data,
    isFetching,
    error: startupConfigError,
  } = useGetStartupConfig({
    // Verhindert 401 ➜ Login-Overlay auf Marketing-Seiten
    enabled: isMarketingPath() ? false : isAuthenticated ? startupConfig === null : true,
  });
  const localize = useLocalize();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/c/new', { replace: true });
    }
    if (data) {
      setStartupConfig(data);
    }
  }, [isAuthenticated, navigate, data]);

  useEffect(() => {
    document.title = startupConfig?.appTitle || 'SIGMACODE AI v0.1.0';
  }, [startupConfig?.appTitle]);

  useEffect(() => {
    setError(null);
    setHeaderText(null);
  }, [location.pathname]);

  // Scroll-Restoration (Best Practice):
  // - POP (Back/Forward): native Scrollposition beibehalten (kein Eingriff)
  // - PUSH/REPLACE (Link-Klick): ohne Hash nach oben scrollen, mit Hash gezielt zur Section
  useEffect(() => {
    if (navigationType === 'POP') return; // Back/Forward: Browser übernimmt

    // Anchor-Navigation: zur Ziel-Section springen
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }

    // Normale Link-Navigation: immer oben starten
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.hash, navigationType]);

  // Referral-Attribution (Last-Click, 90 Tage): speichert r-Param in Cookie + LocalStorage
  useEffect(() => {
    try {
      // Capture on marketing pages and on '/register' explicitly
      if (!(isMarketingPath() || location.pathname === '/register')) return;
      const params = new URLSearchParams(location.search);
      const code = params.get('r');
      if (!code) return;

      // LocalStorage
      const payload = { code, ts: Date.now() };
      localStorage.setItem('referral_attribution', JSON.stringify(payload));

      // Cookie (90 Tage)
      const maxAge = 60 * 60 * 24 * 90; // 90 Tage
      document.cookie = `ref_code=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; samesite=lax`;
    } catch {
      // silent fail
    }
  }, [location.search]);

  const contextValue = {
    error,
    setError,
    headerText,
    setHeaderText,
    startupConfigError,
    startupConfig,
    isFetching,
  };

  const isMarketing = isMarketingPath();

  const headerKey: TranslationKeys = headerMap[location.pathname] ?? 'com_auth_welcome_back';

  // Dynamische Section-IDs für den MarketingHeader je nach Route
  const headerSectionIds = useMemo(() => {
    if (location.pathname === '/') {
      return ['features', 'faq', 'ai-agents', 'mas', 'business-ai', 'pricing-details'];
    }
    if (location.pathname.startsWith('/ai-agents/mas')) {
      // MAS-Seite: hat eine FAQ-Sektion
      return ['faq'];
    }
    if (location.pathname.startsWith('/ai-agents')) {
      // AI-Agents Overview: hat Features- und FAQ-Sektionen
      return ['features', 'faq'];
    }
    if (location.pathname.startsWith('/pricing')) {
      return ['calculator', 'faq'];
    }
    return [] as string[];
  }, [location.pathname]);

  return (
    <>
      {isMarketing ? (
        // Marketingseiten: persistenter MarketingHeader, nur Main-Content via Outlet wechselt
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
          <MarketingHeader sectionIds={headerSectionIds} />
          <main>
            <Outlet context={contextValue} />
          </main>
        </div>
      ) : (
        <AuthLayout
          header={headerText ? localize(headerText) : localize(headerKey)}
          isFetching={isFetching}
          startupConfig={startupConfig}
          startupConfigError={startupConfigError}
          pathname={location.pathname}
          error={error}
        >
          <Outlet context={contextValue} />
        </AuthLayout>
      )}
    </>
  );
}
