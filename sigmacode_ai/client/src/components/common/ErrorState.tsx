import React from 'react';

export type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export default function ErrorState({ message = 'Etwas ist schiefgelaufen.', onRetry, retryLabel = 'Retry', className = '' }: ErrorStateProps) {
  return (
    <div className={`w-full py-8 flex flex-col items-center justify-center ${className}`} role="alert" aria-live="assertive">
      <div className="text-red-600 dark:text-red-400 mb-3 text-center">
        {message}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
