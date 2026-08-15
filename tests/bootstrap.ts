import { assert } from '@japa/assert'
import { expect } from '@japa/expect'

import { apiClient } from '@japa/api-client'
import { browserClient } from '@japa/browser-client'

import ace from '@adonisjs/core/services/ace'

import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'

import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import { shieldApiClient } from '@adonisjs/shield/plugins/api_client'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import { authBrowserClient } from '@adonisjs/auth/plugins/browser_client'
import { sessionBrowserClient } from '@adonisjs/session/plugins/browser_client'
import { inertiaApiClient } from '@adonisjs/inertia/plugins/api_client'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [
  assert(),
  expect(),
  pluginAdonisJS(app),
  apiClient(),
  shieldApiClient(),
  pluginAdonisJS(app),
  sessionBrowserClient(app),
  authBrowserClient(app),
  sessionApiClient(app),
  authApiClient(app),
  browserClient({
    runInSuites: ['browser'],
    contextOptions: {
      baseURL: process.env.APP_INTERNAL_URL,
    },
  }),
  inertiaApiClient(app),
]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executer after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'accounting-functional'].includes(suite.name)) {
    return suite
      .setup(async () => {
        await ace.exec('db:wipe', [])
      })
      .setup(() => testUtils.db().migrate())
      .setup(() => testUtils.db().seed())
      .setup(() => testUtils.httpServer().start())
  }
}
