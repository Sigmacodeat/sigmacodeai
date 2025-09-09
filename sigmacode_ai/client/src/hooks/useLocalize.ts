import { useEffect } from 'react';
import { TOptions } from 'i18next';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import store from '~/store';
// Wichtig: immer aus '~/locales/i18n' importieren.
// In Tests mappt Jest diesen Pfad via moduleNameMapper auf den Shim 'src/shims/i18n.ts'.
import { ensureLanguage } from '~/locales/ensureLanguage';

// Lockerer Typ: erlaubt neue Namespaces/Keys wie marketing.* und gibt garantiert string zurück
export type TranslationKey = string;
// Backwards compatibility: many files still import TranslationKeys
export type TranslationKeys = TranslationKey;

export default function useLocalize() {
  const lang = useRecoilValue(store.lang);
  const { t, i18n } = useTranslation();
  // In der App verwenden wir immer das von react-i18next gelieferte `t`.
  // In Tests wird `useTranslation` gemockt, daher ist kein Shim-Require nötig.
  const tShim: (key: string, options?: TOptions) => string = t;

  useEffect(() => {
    if (i18n.language !== lang) {
      // Zuerst Sprachressourcen lazy laden, dann Sprache wechseln
      ensureLanguage(lang).finally(() => {
        i18n.changeLanguage(lang);
      });
    }
  }, [lang, i18n]);

  return (phraseKey: TranslationKey, options?: TOptions): string => {
    const res = tShim(phraseKey as any, options as any);
    return typeof res === 'string' ? res : String(res);
  };
}

