import React from 'react';
import { reportError } from '@/utils/reportError';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Fehlergrenze zur Absicherung einzelner Landing-Sections.
 * - Kapselt Renderfehler pro Abschnitt
 * - Zeigt dezentes, barrierearmes Fallback-UI
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Fehler-Reporting (Sentry falls konfiguriert, sonst dev-console)
    reportError(error, {
      component: 'Landing.ErrorBoundary',
      info: errorInfo,
    });
  }

  render() {
    const { hasError } = this.state;
    const { fallback, className, children } = this.props;

    if (hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className={[
            'py-8 text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-200 dark:bg-amber-900/20 dark:border-amber-700/40',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {fallback ?? 'Ein Abschnitt konnte nicht geladen werden. Bitte versuche es später erneut.'}
        </div>
      );
    }

    return children;
  }
}
