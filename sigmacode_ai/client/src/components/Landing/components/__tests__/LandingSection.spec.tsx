import React from 'react';
import { render } from '@testing-library/react';
import LandingSection from '../LandingSection';

/**
 * Tests für den einheitlichen Section-Wrapper der Landingpage (`LandingSection`).
 * Prüft Klassen für Border/Padding, aria-Attribute und Analytics-ID.
 */

describe('LandingSection', () => {
  test('rendert mit Default-Klassen (border + padding + scroll-mt)', () => {
    const { container } = render(
      <LandingSection id="features">
        <div>child</div>
      </LandingSection>
    );

    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    const className = section!.className;

    // Border vorhanden (light theme class)
    expect(className).toContain('border-t');
    expect(className).toContain('border-gray-100');

    // Default-Padding
    expect(className).toContain('py-16');
    expect(className).toContain('md:py-24');

    // Scroll margin
    expect(className).toContain('scroll-mt-24');

    // innerer Container
    const inner = section!.querySelector('div');
    expect(inner).not.toBeNull();
    expect(inner!.className).toContain('max-w-7xl');
    expect(inner!.className).toContain('px-4');
  });

  test('entfernt Border mit noBorder', () => {
    const { container } = render(
      <LandingSection id="noborder" noBorder>
        <div>child</div>
      </LandingSection>
    );
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    const className = section!.className;
    expect(className).not.toContain('border-t');
    expect(className).not.toContain('border-gray-100');
  });

  test('compact setzt reduziertes Padding', () => {
    const { container } = render(
      <LandingSection id="compact" compact>
        <div>child</div>
      </LandingSection>
    );
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    const className = section!.className;
    expect(className).toContain('py-12');
    expect(className).toContain('md:py-20');
  });

  test('spacious setzt erhöhtes Padding', () => {
    const { container } = render(
      <LandingSection id="spacious" spacious>
        <div>child</div>
      </LandingSection>
    );
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    const className = section!.className;
    expect(className).toContain('py-20');
    expect(className).toContain('md:py-28');
  });

  test('setzt data-analytics-id automatisch aus id', () => {
    const { container } = render(
      <LandingSection id="analytics-auto">
        <div>child</div>
      </LandingSection>
    );
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    expect(section!.getAttribute('data-analytics-id')).toBe('section-analytics-auto');
  });

  test('überschreibt data-analytics-id wenn analyticsId gesetzt', () => {
    const { container } = render(
      <LandingSection id="analytics-auto" analyticsId="custom-analytics">
        <div>child</div>
      </LandingSection>
    );
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    expect(section!.getAttribute('data-analytics-id')).toBe('custom-analytics');
  });

  test('setzt aria-labelledby und akzeptiert zusätzliche Props', () => {
    const { container } = render(
      <LandingSection id="a11y" ariaLabelledby="heading-id" role="region" className="custom">
        <div>child</div>
      </LandingSection>
    );
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    expect(section!.getAttribute('aria-labelledby')).toBe('heading-id');
    expect(section!.getAttribute('role')).toBe('region');
    expect(section!.className).toContain('custom');
  });
});
