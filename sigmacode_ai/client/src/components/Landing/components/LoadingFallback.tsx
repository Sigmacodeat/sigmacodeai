import React from 'react';

interface LoadingFallbackProps {
  label?: string;
  className?: string;
}

/**
 * Einheitlicher Suspense-Fallback für Landing-Sections.
 * Respektiert reduzierte Bewegung (visuell dezent), neutraler Text.
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  label = 'Loading…',
  className,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={['py-8 text-center text-sm text-gray-500', className].filter(Boolean).join(' ')}
    >
      {label}
    </div>
  );
};

export default LoadingFallback;
