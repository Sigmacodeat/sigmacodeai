import React from 'react';
import clsx from 'clsx';

export interface SectionProps {
  id?: string;
  ariaLabel?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

/**
 * Einheitlicher Wrapper für Landing-Sections.
 * - Vereinheitlichte max-width & Padding
 * - Optionale id für Deep-Linking & Analytics
 * - Optionales ariaLabel, setzt role/aria-label nur wenn sinnvoll
 */
export const Section: React.FC<SectionProps> = ({
  id,
  ariaLabel,
  as = 'section',
  className,
  children,
}) => {
  const Component = as as any;
  return (
    <Component
      id={id}
      aria-label={ariaLabel}
      className={clsx(
        'mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8',
        // Vertikaler Rhythmus
        'py-8 sm:py-12 lg:py-16',
        className,
      )}
    >
      {children}
    </Component>
  );
};

export default Section;
