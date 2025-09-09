import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { createTestI18n } from './i18nForTests';

export function Providers({ children }: PropsWithChildren) {
  const i18n = createTestI18n();
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{children}</MemoryRouter>
    </I18nextProvider>
  );
}
