import React, { ReactNode } from 'react';

type BaseProps = {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
};

interface SourcesErrorBoundaryProps extends BaseProps {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class InnerSourcesErrorBoundary extends React.Component<
  SourcesErrorBoundaryProps,
  State,
  any
> {
  state: Readonly<State> = { hasError: false };

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Sources error:', error);
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      /* eslint-disable i18next/no-literal-string */
      return (
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-border-medium bg-surface-secondary p-4 text-center"
          role="alert"
          aria-live="polite"
        >
          <div className="mb-2 text-sm text-text-secondary">Sources temporarily unavailable</div>
          <button
            onClick={() => window.location.reload()}
            className="hover:bg-surface-primary-hover rounded-md bg-surface-primary px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Reload the page"
          >
            Refresh
          </button>
        </div>
      );
      /* eslint-enable i18next/no-literal-string */
    }

    return this.props.children as ReactNode;
  }
}

export default function SourcesErrorBoundary(props: SourcesErrorBoundaryProps) {
  return React.createElement(
    InnerSourcesErrorBoundary as unknown as React.ComponentType<SourcesErrorBoundaryProps>,
    props,
  );
}
