import { ProfilingIntegration } from '@sentry/profiling-node'
import * as Sentry from '@sentry/node'
import env from './env.js'

Sentry.init({
  dsn: env.get('SENTRY_DNS'),
  environment: env.get('NODE_ENV'),
  debug: false,
  release: process.env.npm_package_version,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    new ProfilingIntegration(),
  ],
})
