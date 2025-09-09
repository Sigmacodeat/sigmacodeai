import React from 'react';

export type LoadingProps = {
  label?: string;
  className?: string;
};

export default function Loading({ label = 'Loading…', className = '' }: LoadingProps) {
  return (
    <div
      className={`w-full py-8 flex items-center justify-center text-gray-600 dark:text-gray-300 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="inline-flex items-center gap-2">
        <svg
          className="animate-spin h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span>{label}</span>
      </span>
    </div>
  );
}
