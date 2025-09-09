// i18n: explizite, zyklusfreie Mocks, um ESM-Importe (import.meta.glob) zu vermeiden
// Wichtig: kein require() des Shims oder der echten i18n-Datei, um Rekursion zu vermeiden
const mockI18n = {
  ensureLanguage: async () => {},
  default: {
    language: 'en',
    t: (key) => String(key),
    changeLanguage: async (lng) => lng || 'en',
    hasResourceBundle: () => true,
    addResourceBundle: () => undefined,
    use: function () {
      return this;
    },
    init: async function () {
      return this;
    },
  },
};

jest.mock('src/locales/i18n', () => mockI18n, { virtual: true });
jest.mock('~/locales/i18n', () => mockI18n, { virtual: true });
jest.mock('src/locales/ensureLanguage', () => mockI18n, { virtual: true });
jest.mock('~/locales/ensureLanguage', () => mockI18n, { virtual: true });

// Zusätzlich: absolute Pfade abfangen (wenn Babel/ts-jest auf absolute Pfade resovlt)
const path = require('path');
const rootDir = process.cwd();
const absI18nTs = path.join(rootDir, 'src', 'locales', 'i18n.ts');
const absI18nIndex = path.join(rootDir, 'src', 'locales', 'i18n');
const absEnsureLangTs = path.join(rootDir, 'src', 'locales', 'ensureLanguage.ts');
const absEnsureLangIndex = path.join(rootDir, 'src', 'locales', 'ensureLanguage');
try {
  jest.mock(absI18nTs, () => mockI18n);
} catch {}
try {
  jest.mock(absI18nIndex, () => mockI18n);
} catch {}
try {
  jest.mock(absEnsureLangTs, () => mockI18n);
} catch {}
try {
  jest.mock(absEnsureLangIndex, () => mockI18n);
} catch {}

// ------------------------------------------------------------
// requestAnimationFrame Polyfill für JSDOM
// Dropdown.tsx nutzt rAF, um Fokus nach Öffnen zu setzen
// ------------------------------------------------------------
if (typeof global.requestAnimationFrame === 'undefined') {
  // einfache asynchrone Ausführung in der nächsten Tick/Task
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}

if (typeof global.cancelAnimationFrame === 'undefined') {
  global.cancelAnimationFrame = (id) => clearTimeout(id);
}

// ------------------------------------------------------------
// Global fetch polyfill for Jest (jsdom does not include fetch by default)
// Keep it minimal and overridable per test via jest.spyOn(global, 'fetch')
// ------------------------------------------------------------
if (typeof global.fetch === 'undefined') {
  // Lightweight default mock response
  const defaultResponse = {
    ok: true,
    status: 200,
    headers: new Map(),
    json: async () => ({}),
    text: async () => '',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.fetch = jest.fn(async () => ({ ...defaultResponse }));
}

