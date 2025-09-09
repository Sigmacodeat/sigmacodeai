import React from 'react';
import { render, screen } from '@testing-library/react';

// Test-lokaler i18n-Mock: respektiert defaultValue
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
import { CallToAction } from '../BusinessAI';

/**
 * Snapshot- und Rendering-Tests für die wiederverwendbare CallToAction-Komponente.
 * Prüft beide Varianten (hero, card) und die Motion-Option (nur Render, kein Animationsassert).
 */

describe('CallToAction', () => {
  const baseProps = {
    id: 'test-cta',
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    primary: {
      to: '/primary',
      label: 'Primary',
      ariaLabel: 'Primary Label',
      titleAttr: 'Primary Title',
      analytics: 'primary-analytics',
    },
    secondary: {
      to: '/secondary',
      label: 'Secondary',
      ariaLabel: 'Secondary Label',
      titleAttr: 'Secondary Title',
      analytics: 'secondary-analytics',
    },
  } as const;

  it('renders hero variant with buttons', () => {
    const { container } = render(
      <Providers>
        <CallToAction {...baseProps} variant="hero" />
      </Providers>
    );

    expect(screen.getByRole('heading', { name: baseProps.title })).toBeInTheDocument();
    expect(screen.getByText(baseProps.subtitle)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /primary/i })).toHaveAttribute('href', baseProps.primary.to);
    expect(screen.getByRole('link', { name: /secondary/i })).toHaveAttribute('href', baseProps.secondary!.to);
    expect(container).toMatchSnapshot();
  });

  it('renders card variant with motion enabled', () => {
    const { container } = render(
      <Providers>
        <CallToAction {...baseProps} variant="card" motion />
      </Providers>
    );

    // In card-Variante ist Title als sr-only vorhanden, Subtitle sichtbar
    expect(screen.getByText(baseProps.subtitle)).toBeInTheDocument();
    // Titel ist als sr-only vorhanden
    const srOnlyHeading = container.querySelector('h2.sr-only');
    expect(srOnlyHeading).not.toBeNull();
    // Buttons vorhanden
    expect(screen.getByRole('link', { name: /primary/i })).toHaveAttribute('href', baseProps.primary.to);
    expect(screen.getByRole('link', { name: /secondary/i })).toHaveAttribute('href', baseProps.secondary!.to);
  });
});
