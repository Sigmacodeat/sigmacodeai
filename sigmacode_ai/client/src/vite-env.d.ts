/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_LOGGER: string;
  readonly VITE_LOGGER_FILTER: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_ANALYTICS_ENABLED?: 'true' | 'false';
  readonly VITE_ANALYTICS_DEBUG?: 'true' | 'false';
  readonly VITE_DEV_EMAIL_ADMIN_TOKEN?: string;
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
