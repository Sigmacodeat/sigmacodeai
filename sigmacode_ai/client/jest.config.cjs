module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost:3080',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules/',
    '!src/**/*.css.d.ts',
    '!src/**/*.d.ts',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/test/setupTests.js'],
  //  Todo: Add coverageThreshold once we have enough coverage
  //  Note: eventually we want to have these values set to 80%
  // coverageThreshold: {
  //   global: {
  //     functions: 9,
  //     lines: 40,
  //     statements: 40,
  //     branches: 12,
  //   },
  // },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-file-loader',
    '^test/(.*)$': '<rootDir>/test/$1',
    // Mock framer-motion hooks/components for JSDOM tests
    '^framer-motion$': '<rootDir>/src/test/__mocks__/framer-motion.ts',
    // Wichtig: spezifischen i18n-Shim vor dem generischen ~ Alias platzieren
    // Explizite Mappings zuerst, falls Regex nicht greift
    '^~/locales/i18n$': '<rootDir>/src/shims/i18n.ts',
    '^src/locales/i18n$': '<rootDir>/src/shims/i18n.ts',
    '^(?:~|src)/locales/i18n(?:\\.(ts|js))?$': '<rootDir>/src/shims/i18n.ts',
    // ensureLanguage-Proxy ebenfalls auf Shim mappen
    '^~/locales/ensureLanguage$': '<rootDir>/src/shims/i18n.ts',
    '^src/locales/ensureLanguage$': '<rootDir>/src/shims/i18n.ts',
    // Relativer Import in main.jsx
    '^\\./locales/i18n$': '<rootDir>/src/shims/i18n.ts',
    // Falls Babel absolute Pfade erzeugt (root-import), fange alle Varianten ab
    '.*[\\/]?src[\\/]locales[\\/]i18n(?:\\.(ts|js))?$': '<rootDir>/src/shims/i18n.ts',
    // Falls babel-plugin-root-import auf 'src/..' umschreibt
    '^src/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^librechat-data-provider/react-query$': '<rootDir>/../node_modules/librechat-data-provider/src/react-query',
  },
  restoreMocks: true,
  testResultsProcessor: 'jest-junit',
  coverageReporters: ['text', 'cobertura', 'lcov'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-file-loader',
  },
  transformIgnorePatterns: ['node_modules/?!@zattoo/use-double-click'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/test/setupFiles.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/test/setupTests.js'],
  clearMocks: true,
};
