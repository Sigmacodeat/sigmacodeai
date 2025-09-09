/* This file is automatically executed before running tests
 * https://create-react-app.dev/docs/running-tests/#initializing-test-environment
 */

// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
// https://github.com/testing-library/jest-dom#table-of-contents
import '@testing-library/jest-dom';

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock canvas when run unit test cases with jest.
// 'react-lottie' uses canvas
import 'jest-canvas-mock';

// Mock ResizeObserver
import './resizeObserver.mock';

// Kein expliziter i18n-Mock hier – moduleNameMapper mappt '~/locales/i18n' auf den Shim

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

beforeEach(() => {
  jest.clearAllMocks();
});

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('react-i18next', () => {
  const actual = jest.requireActual('react-i18next');
  const map = {
    // UI
    com_ui_stop: 'Stop',
    com_ui_install: 'Install',
    com_ui_save: 'Save',
    // Plugin store actions
    com_nav_plugin_install: 'Install',
    com_nav_plugin_uninstall: 'Uninstall',
    com_nav_plugin_search: 'Search plugins',
    // Auth
    com_auth_continue: 'Continue',
    com_auth_email: 'Email',
    com_auth_email_address: 'Email address',
    com_auth_password: 'Password',
    com_auth_full_name: 'Full name',
    com_auth_username: 'Username',
    com_auth_email_pattern: 'You must enter a valid email address',
    com_auth_password_min_length: 'Password must be at least 8 characters',
    com_auth_password_forgot: 'Forgot password',
    com_auth_password_not_match: 'Passwords do not match',
    com_auth_name_min_length: 'Name must be at least 3 characters',
    com_auth_username_min_length: 'Username must be at least 2 characters',
    com_auth_already_have_account: 'Already have an account?',
    com_auth_login: 'Login',
    com_auth_error_create: 'There was an error attempting to register your account. Please try again.',
    com_auth_registration_success_generic: 'Registration successful',
    com_auth_registration_success_insecure: 'Registration successful',
    com_auth_email_verification_redirecting: 'Redirecting in {0} seconds',
    com_auth_email_required: 'Email is required',
    com_auth_email_min_length: 'Email must not be empty',
    com_auth_password_required: 'Password is required',
    com_auth_password_max_length: 'Password is too long',
    com_auth_name_required: 'Name is required',
    com_auth_name_max_length: 'Name is too long',
    com_auth_username_max_length: 'Username is too long',
    // Social Login
    com_auth_google_login: 'Continue with Google',
    com_auth_facebook_login: 'Continue with Facebook',
    com_auth_github_login: 'Continue with Github',
    com_auth_discord_login: 'Continue with Discord',
    com_auth_apple_login: 'Continue with Apple',
    com_auth_saml_login: 'SAML',
    // Language selector
    com_nav_language: 'Language',
    com_nav_lang_auto: 'Auto',
    com_nav_lang_english: 'English',
    com_nav_lang_italian: 'Italiano',
    com_nav_lang_chinese: 'Chinese',
    com_nav_lang_traditional_chinese: 'Traditional Chinese',
    // Theme
    com_nav_theme: 'Theme',
    com_nav_theme_system: 'System',
    com_nav_theme_dark: 'Dark',
    com_nav_theme_light: 'Light',
  };
  const humanize = (key) => {
    const parts = String(key).split('_').filter(Boolean);
    const clean = parts.filter((p) => !['com', 'ui', 'auth', 'nav', 'lang'].includes(p));
    const txt = (clean.length ? clean : parts).join(' ');
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  };
  const i18n = {
    language: 'en',
    changeLanguage: jest.fn(async (lng) => (i18n.language = lng || 'en')),
  };
  const t = (key) => map[key] ?? humanize(key);
  return {
    ...actual,
    useTranslation: () => ({ t, i18n }),
    initReactI18next: { type: '3rdParty', init: jest.fn() },
    Trans: ({ children }) => (typeof children === 'function' ? children(t) : children),
  };
});
