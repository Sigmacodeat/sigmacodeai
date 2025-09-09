// Jest-Shim für i18n, um ESM-Features wie import.meta.glob im Test zu vermeiden
// Spiegelt die minimalen Exports von '~/locales/i18n' wider

export async function ensureLanguage(_lng: string): Promise<void> {
  // no-op im Test
}

type TOptions = Record<string, unknown> | undefined;

// Kleine englische Übersetzungstabelle für Tests
const enTranslations: Record<string, string> = {
  // Buttons/UI
  com_ui_stop: 'Stop',
  com_ui_install: 'Install',
  com_ui_save: 'Save',
  com_auth_continue: 'Continue',

  // Auth Labels
  com_auth_email: 'Email',
  com_auth_email_address: 'Email address',
  com_auth_password: 'Password',
  com_auth_full_name: 'Full name',
  com_auth_username: 'Username',

  // Auth Fehlertexte
  com_auth_email_pattern: 'You must enter a valid email address',
  com_auth_password_min_length: 'Password must be at least 8 characters',
  com_auth_password_forgot: 'Forgot password',
  com_auth_password_not_match: 'Passwords do not match',
  com_auth_name_min_length: 'Name must be at least 3 characters',
  com_auth_username_min_length: 'Username must be at least 2 characters',

  // Plugin Store
  com_nav_plugin_store: 'Plugin store',
  com_nav_plugin_search: 'Search plugins',
  com_nav_plugin_install: 'Install',
  com_nav_plugin_uninstall: 'Uninstall',

  // Language Selector
  com_nav_language: 'Language',
  com_nav_lang_auto: 'Auto',
  com_nav_lang_english: 'English',
  com_nav_lang_italian: 'Italiano',
  com_nav_lang_chinese: 'Chinese',
  com_nav_lang_traditional_chinese: 'Traditional Chinese',

  // Theme Selector
  com_nav_theme: 'Theme',
  com_nav_theme_system: 'System',
  com_nav_theme_dark: 'Dark',
  com_nav_theme_light: 'Light',

  // Social Login Labels
  com_auth_google_login: 'Continue with Google',
  com_auth_facebook_login: 'Continue with Facebook',
  com_auth_github_login: 'Continue with Github',
  com_auth_discord_login: 'Continue with Discord',
  com_auth_apple_login: 'Continue with Apple',
  com_auth_saml_login: 'SAML',

  // Sonstige Auth-Texte
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
};

function humanize(key: string): string {
  if (!key) return key;
  // Entferne Präfixe wie com_*
  const parts = key.split('_').filter(Boolean);
  const clean = parts.filter((p) => !['com', 'ui', 'auth'].includes(p));
  const txt = (clean.length ? clean : parts).join(' ');
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

// Minimaler i18n-Stub mit den Feldern/Methoden, die im Code referenziert werden könnten
const i18n = {
  language: 'en',
  t: (key: string, _options?: TOptions) => enTranslations[key] ?? humanize(key),
  changeLanguage: async (lng?: string) => {
    if (lng) i18n.language = lng;
    return i18n.language;
  },
  hasResourceBundle: (_lng: string, _ns: string) => true,
  addResourceBundle: (_lng: string, _ns: string, _res: any) => undefined,
  use: (_: unknown) => i18n,
  init: async (_opts?: unknown) => i18n,
};

export default i18n;
