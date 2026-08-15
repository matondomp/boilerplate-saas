import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: process.env.PUBLIC_SENTRY_DNS,
  environment: process.env.NODE_ENV,
  release: process.env.npm_package_version,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],

  tracesSampleRate: 1.0,

  tracePropagationTargets: [process.env.APP_INTERNAL_URL],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
