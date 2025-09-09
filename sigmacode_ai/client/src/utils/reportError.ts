// Optionales Fehler-Reporting (Sentry), nur aktiv wenn DSN vorhanden
// Funktioniert auch ohne installierte Sentry-Dependency (silent noop)

export type ErrorContext = {
  component?: string;
  info?: unknown;
  extra?: Record<string, unknown>;
};

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
let sentryInitialized = false;

async function ensureSentry() {
  if (!DSN) return null;
  try {
    // Hinweis: Nutzung eines variablen Specifiers mit Vite-Ignores, damit das Paket
    // nur zur Laufzeit (falls DSN gesetzt) aufgelöst wird. So bricht die App nicht,
    // wenn '@sentry/browser' nicht installiert ist.
    const mod = '@sentry/browser';
    const Sentry = await import(/* @vite-ignore */ mod);
    if (!sentryInitialized && Sentry?.init) {
      Sentry.init({ dsn: DSN });
      sentryInitialized = true;
    }
    return Sentry ?? null;
  } catch {
    // Sentry ist nicht installiert oder Import fehlgeschlagen
    return null;
  }
}

export async function reportError(err: unknown, context?: ErrorContext) {
  const Sentry = await ensureSentry();
  if (Sentry) {
    Sentry.withScope((scope) => {
      if (context?.component) scope.setTag('component', context.component);
      if (context?.extra) scope.setExtras(context.extra);
      scope.setExtra('info', context?.info ?? null);
      Sentry.captureException(err);
    });
  } else if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('[reportError]', err, context);
  }
}
