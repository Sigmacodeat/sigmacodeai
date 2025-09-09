import React, { useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { cn } from '~/utils';
import store from '~/store';
import { ensureLanguage } from '~/locales/ensureLanguage';

/**
 * LanguageToggle
 * - Minimaler EN/DE-Schalter für Header/Landing
 * - Persistenz via Cookie 'lang' + Recoil store.lang
 * - Setzt document.documentElement.lang client-seitig
 */
export default function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useRecoilState(store.lang);

  // documentElement.lang synchron halten (nur Client)
  useEffect(() => {
    if (typeof document !== 'undefined' && lang) {
      requestAnimationFrame(() => {
        document.documentElement.lang = lang;
      });
    }
  }, [lang]);

  const setLanguage = useCallback(
    (value: 'de-DE' | 'en-US') => {
      setLang(value);
      Cookies.set('lang', value, { expires: 365 });
      // Ressourcen nachladen und Sprache global wechseln
      ensureLanguage(value).finally(() => {
        i18n.changeLanguage(value);
      });
    },
    [setLang, i18n],
  );

  const isDE = lang?.toLowerCase()?.startsWith('de');
  const isEN = lang?.toLowerCase()?.startsWith('en');

  return (
    <div className={cn('inline-flex items-center', className)}>
      <div role="group" aria-label="Language selector" className="inline-flex rounded-md border border-border p-0.5 bg-transparent">
        <button
          type="button"
          className={cn(
            'rounded px-2 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-border',
            isDE
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-cyan-200'
              : 'text-text-secondary hover:text-text-primary',
          )}
          aria-pressed={isDE}
          onClick={() => setLanguage('de-DE')}
        >
          DE
        </button>
        <button
          type="button"
          className={cn(
            'rounded px-2 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-border',
            isEN
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-cyan-200'
              : 'text-text-secondary hover:text-text-primary',
          )}
          aria-pressed={isEN}
          onClick={() => setLanguage('en-US')}
        >
          EN
        </button>
      </div>
    </div>
  );
}
