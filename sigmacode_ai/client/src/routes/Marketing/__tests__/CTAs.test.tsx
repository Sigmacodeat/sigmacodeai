import React from 'react';
import { render, screen } from '@testing-library/react';

// Test-lokaler i18n-Mock: respektiert defaultValue aus Optionen
jest.mock('react-i18next', () => {
  const actual = jest.requireActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, opts?: any) => (opts && opts.defaultValue) || key,
      i18n: { language: 'de', changeLanguage: jest.fn() },
    }),
  };
});

// IntersectionObserver Mock für framer-motion viewport/whileInView
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.IntersectionObserver = IO as any;

import { Providers } from '../../../test/renderWithProviders';
import { CTA, MidCTA } from '../BusinessAI';

/**
 * Tests für die konkreten CTA-Verwendungen (CTA hero unten, MidCTA card mit Motion):
 * - i18n-Fallback über defaultValue (da keine Ressourcen registriert)
 */

describe('CTA and MidCTA integrations', () => {
  it('renders bottom CTA (hero) with default i18n fallbacks', () => {
    render(
      <Providers>
        <CTA />
      </Providers>
    );

    // Texte kommen aus defaultValue in BusinessAI.tsx
    expect(screen.getByText('Business AI sicher ausrollen')).toBeInTheDocument();
    expect(
      screen.getByText('Governance, RAG, Observability – alles aus einem Guss.')
    ).toBeInTheDocument();
    // Primary-Link hat aria-label => direkt per getByLabelText abfragen
    expect(screen.getByLabelText('Business AI im AI Chat testen')).toBeInTheDocument();
    // Secondary-Link hat ebenfalls ein aria-label, das den Accessible Name bestimmt
    expect(
      screen.getByLabelText('Zu den Pricing-Details und Kalkulator')
    ).toBeInTheDocument();

    // Keine Snapshot-Assertion
  });

  it('renders MidCTA (card + motion) with default i18n fallbacks', () => {
    render(
      <Providers>
        <MidCTA />
      </Providers>
    );

    // Title ist sr-only; Subtitle sichtbar
    expect(
      screen.getByText('Governance, RAG, Observability – alles aus einem Guss.')
    ).toBeInTheDocument();
    // Primary-Link hat aria-label => direkt per getByLabelText abfragen
    expect(screen.getByLabelText('Business AI im AI Chat testen')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Technische Doku' })).toBeInTheDocument();

    // Keine Snapshot-Assertion
  });
});
