import * as Sentry from '@sentry/nextjs';

interface TErrorData {
  contextName: string;
  contextData?: Record<string, unknown>;
  fingerprint?: string[];
  error: unknown;
}

export function monitorError({
  contextName,
  contextData,
  fingerprint,
  error,
}: TErrorData) {
  if (process.env.NODE_ENV === 'development') {
    console.error({ error, contextName, contextData, fingerprint });
  } else {
    Sentry.withScope((scope) => {
      scope.setContext(contextName, { ...contextData });

      if (fingerprint) {
        scope.setFingerprint(fingerprint);
      }

      Sentry.captureException(error);
    });
  }
}
