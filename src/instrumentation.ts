export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = (await import('@sentry/nextjs')).default;

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
      release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
      tracesSampleRate: 1.0,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true })
      ],
      enabled: process.env.NODE_ENV === 'production',
      beforeSend(event) {
        if (event.exception) {
          Sentry.showReportDialog({ eventId: event.event_id });
        }
        return event;
      }
    });
  }
}