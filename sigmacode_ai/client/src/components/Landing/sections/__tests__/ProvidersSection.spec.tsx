import React from 'react';
import { render, screen, within } from '@testing-library/react';
import ProvidersSection from '../ProvidersSection';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import deTranslations from '../../../../locales/de/translation.json';

function createI18nWith(resources?: any, lng: string = 'de') {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    lng,
    fallbackLng: lng,
    resources: resources ?? {},
    interpolation: { escapeValue: false },
    returnNull: false,
  });
  return instance;
}

function renderWith(i18nInstance: any) {
  return render(
    <I18nextProvider i18n={i18nInstance}>
      <MemoryRouter>
        <ProvidersSection />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe('ProvidersSection', () => {
  test('rendert 9 Default-Provider ohne i18n-Ressourcen (Fallback über defaultValue)', () => {
    const i18nInstance = createI18nWith();
    const { container } = renderWith(i18nInstance);

    // ul hat role=list, li Elemente
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items.length).toBe(9);

    // Stichprobe über Detail-Links per href (locale-unabhängig)
    expect(container.querySelectorAll('a[href="/providers/openai"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('a[href="/providers/anthropic"]').length).toBeGreaterThan(0);

    // Details-Label (als Link, locale-agnostisch via /details/i)
    const detailLinks = within(list).getAllByRole('link', { name: /details/i });
    expect(detailLinks.length).toBeGreaterThan(0);
  });

  test('leeres i18n-Array führt zu Fallback auf Defaults (weiterhin 9 Einträge)', () => {
    const resources = {
      de: {
        translation: {
          marketing: {
            landing: {
              providers: {
                items: [],
              },
            },
          },
          // Keine Details-Keys -> Komponente nutzt Default-Title/Subtitel/Content-Fallbacks pro Provider
        },
      },
    };
    const i18nInstance = createI18nWith(resources, 'de');
    const { container } = renderWith(i18nInstance);

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items.length).toBe(9);

    // Ein paar Provider sollten weiterhin erscheinen (Fallback auf defaultProviders)
    expect(container.querySelectorAll('a[href="/providers/mistral"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('a[href="/providers/groq"]').length).toBeGreaterThan(0);
  });

  test('A11y-Attribute vorhanden (aria-controls/expanded und Panel-Verknüpfung)', () => {
    const i18nInstance = createI18nWith();
    renderWith(i18nInstance);

    // Nimm erstes Listitem
    const list = screen.getByRole('list');
    const [firstItem] = within(list).getAllByRole('listitem');

    const button = within(firstItem).getByRole('button');
    const ariaControls = button.getAttribute('aria-controls');
    expect(ariaControls).toMatch(/^provider-panel-/);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('DE-Übersetzungen: Detail-Links vorhanden und hrefs korrekt', () => {
    const resources = {
      de: { translation: deTranslations as any },
    };
    const i18nInstance = createI18nWith(resources, 'de');
    const { container } = renderWith(i18nInstance);

    const list = screen.getByRole('list');
    // Es gibt pro Provider einen Details-Link -> insgesamt 9
    const detailLinks = within(list).getAllByRole('link');
    expect(detailLinks.length).toBe(9);
    // Stichprobe erwarteter hrefs
    expect(container.querySelector('a[href="/providers/openai"]')).toBeTruthy();
    expect(container.querySelector('a[href="/providers/anthropic"]')).toBeTruthy();
  });
});
