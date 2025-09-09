import React from 'react';

/**
 * Skip-to-content Link für bessere Tastatur-Navigation.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:bg-gray-900 dark:focus:text-white"
    >
      Skip to content
    </a>
  );
}
