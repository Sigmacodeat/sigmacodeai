import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimal i18n-Instanz für Tests ohne Ressourcen
export function createTestI18n() {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    lng: 'de',
    fallbackLng: 'de',
    resources: {},
    interpolation: { escapeValue: false },
    // Wichtiger Schalter: nutzt defaultValue, wenn Key fehlt
    returnNull: false,
  });
  return instance;
}
