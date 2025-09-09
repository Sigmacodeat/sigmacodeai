import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// Statisch nur EN laden – alle anderen Sprachen werden on-demand geladen
import enJson from './en/translation.json';
// WICHTIG: Klonen in ein Literal + as const, damit TS die Keys als Literaltypen ableitet (für strictKeyChecks)
export const translationEn = { ...enJson } as const;

export const defaultNS = 'translation';

export const resources = {
  en: { translation: translationEn },
} as const;

// Lazy-Loader für weitere Sprachen (Vite dyn. Imports)
const loaders = import.meta.glob('./*/translation.json');
const loaded: Record<string, boolean> = { en: true };

export async function ensureLanguage(lng: string): Promise<void> {
  if (!lng) return;
  // Basis-Locale extrahieren (z. B. de-DE -> de)
  const base = lng.split('-')[0];
  if (loaded[base]) return;
  const key = `./${base}/translation.json`;
  const loader = (loaders as Record<string, () => Promise<any>>)[key];
  if (!loader) {
    // Kein Loader gefunden – auf EN zurückfallen
    loaded[base] = true; // vermeiden wiederholter Versuche
    return;
  }
  const mod = await loader();
  const data = mod.default ?? mod;
  if (!i18n.hasResourceBundle(base, 'translation')) {
    i18n.addResourceBundle(base, 'translation', data, true, true);
  }
  loaded[base] = true;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'de'],
    fallbackLng: {
      'zh-TW': ['zh-Hant', 'en'],
      'zh-HK': ['zh-Hant', 'en'],
      zh: ['zh-Hans', 'en'],
      default: ['en'],
    },
    fallbackNS: 'translation',
    ns: ['translation'],
    debug: false,
    defaultNS,
    resources,
    interpolation: { escapeValue: false },
  });

// Detektierte Sprache (falls nicht EN) vorladen
const initial = i18n.language;
if (initial && initial !== 'en') {
  // Fire-and-forget – React Components triggern changeLanguage später
  ensureLanguage(initial);
}

export default i18n;
