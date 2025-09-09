import React from 'react';
import { useNavigate } from 'react-router-dom';

export type BackButtonProps = {
  label?: string;
  className?: string;
  fallbackTo?: string; // optional: falls history leer ist
};

/**
 * BackButton – leichter Zurück-CTA für Marketingseiten
 * - nutzt history.back(), fällt optional auf eine Route zurück
 */
export default function BackButton({ label = 'Zurück', className, fallbackTo = '/' }: BackButtonProps) {
  const navigate = useNavigate();

  const onClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 ${className ?? ''}`}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414l4-4A1 1 0 0 1 7.707 6.293L5.414 8.586H17a1 1 0 1 1 0 2H5.414l2.293 2.293a1 1 0 0 1 0 1.414Z" clipRule="evenodd" />
      </svg>
      {label}
    </button>
  );
}
