import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

// Mock i18n: t(key, { defaultValue }) => defaultValue || key (keine i18n-Provider-Abhängigkeit)
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key,
  }),
}));

// Mock framer-motion: motion.* als Wrapper + Hooks als Noops
jest.mock('framer-motion', () => {
  const React = require('react');
  const handler = {
    get: () => ({ children, ...rest }: any) => React.createElement('div', rest, children),
  };
  const motion = new Proxy({}, handler);
  const useReducedMotion = () => false;
  const useInView = () => true;
  return { motion, useReducedMotion, useInView };
});

import DesignDemo from '../DesignDemo';

// Minimaler i18n-Fallback durch defaultValue in der Seite selbst ausreichend.

describe('DesignDemo page', () => {
  function renderPage(initialEntries: string[] = ['/design-demo']) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/design-demo" element={<DesignDemo />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('renders hero title and CTA links', () => {
    renderPage();

    // Hero Title (mehrsprachig: Deutsch oder Englisch)
    expect(
      screen.getByRole('heading', {
        name: /(Designsystem & Komponenten|Design System & Components)/i,
      })
    ).toBeInTheDocument();

    // CTA-Links
    // Primär-CTA (mehrsprachig oder per href)
    const primaryCta = screen.getByRole('link', {
      name: /(Jetzt ausprobieren|Try it now)/i,
    });
    expect(primaryCta).toHaveAttribute('href', '/c/new');

    // Sekundär-CTA (mehrsprachig oder per href)
    const secondaryCta = screen.getByRole('link', {
      name: /(Preise ansehen|View pricing)/i,
    });
    expect(secondaryCta).toHaveAttribute('href', '/pricing');
  });

  test('renders sections tokens and components', () => {
    renderPage();

    // Section headings (mehrsprachig)
    expect(screen.getByRole('heading', { name: /Design Tokens/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /(Komponenten|Components)/i, level: 2 })
    ).toBeInTheDocument();
  });
});
