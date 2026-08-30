import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Commands
  |--------------------------------------------------------------------------
  |
  | List of ace commands to register from packages. The application commands
  | will be scanned automatically from the "./commands" directory.
  |
  */
  commands: [
    () => import('@adonisjs/core/commands'),
    () => import('@acidiney/bull-queue/commands'),
    () => import('@adonisjs/lucid/commands'),
    () => import('@adonisjs/mail/commands'),
  ],

  /*
  |--------------------------------------------------------------------------
  | Service providers
  |--------------------------------------------------------------------------
  |
  | List of service providers to import and register when booting the
  | application
  |
  */
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    {
      file: () => import('@adonisjs/core/providers/repl_provider'),
      environment: ['repl', 'test'],
    },
    () => import('@adonisjs/core/providers/vinejs_provider'),
    () => import('@adonisjs/core/providers/edge_provider'),
    () => import('@adonisjs/session/session_provider'),
    () => import('@adonisjs/vite/vite_provider'),
    () => import('@adonisjs/shield/shield_provider'),
    () => import('@adonisjs/static/static_provider'),
    () => import('@adonisjs/cors/cors_provider'),
    () => import('@adonisjs/lucid/database_provider'),
    () => import('@adonisjs/auth/auth_provider'),
    () => import('@adonisjs/inertia/inertia_provider'),
    () => import('@adonisjs/redis/redis_provider'),
    () => import('@adonisjs/i18n/i18n_provider'),
    () => import('@acidiney/bull-queue/queue_provider'),
    () => import('@adonisjs/limiter/limiter_provider'),
    () => import('@adonisjs/mail/mail_provider'),
    () => import('@adonisjs/lock/lock_provider'),
    {
      file: () => import('#providers/app_provider'),
      environment: ['repl', 'web'],
    },
    {
      file: () => import('#providers/app_socket_provider'),
      environment: ['web'],
    },
    () => import('adonisjs-6-swagger/swagger_provider'),
  ],

  /*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  |
  | List of modules to import before starting the application.
  |
  */
  preloads: [
    () => import('#start/main'),
    () => import('#start/sentry'),
    () => import('#start/kernel'),
  ],

  /*
  |--------------------------------------------------------------------------
  | Tests
  |--------------------------------------------------------------------------
  |
  | List of test suites to organize tests by their type. Feel free to remove
  | and add additional suites.
  |
  */
  tests: {
    suites: [
      {
        files: ['app/modules/**/*.spec.ts', 'app/modules/**/*.spec.js'],
        name: 'unit',
        timeout: 2000,
      },
      {
        files: [
          'app/modules/addons/accounting/usecases/**/*.spec.ts',
          'app/modules/addons/accounting/usecases/**/*.spec.js',
        ],
        name: 'accounting-unit',
        timeout: 5000,
      },
      {
        files: [
          'app/**/*.test.ts',
          'app/**/*.test.js',
          'tests/functional/**/*.test.ts',
          'tests/functional/**/*.test.js',
        ],
        name: 'functional',
        timeout: 30000,
      },
      {
        files: [
          'app/modules/addons/accounting/framework/tests/integration/**/*.test.ts',
          'app/modules/addons/accounting/framework/tests/integration/**/*.test.js',
        ],
        name: 'accounting-functional',
        timeout: 30000,
      },
      {
        name: 'browser',
        timeout: 60000,
        files: ['app/modules/**/*.browser.ts', 'app/modules/**/*.browser.js'],
      },
    ],
    forceExit: false,
  },

  /*
  |--------------------------------------------------------------------------
  | Metafiles
  |--------------------------------------------------------------------------
  |
  | A collection of files you want to copy to the build folder when creating
  | the production build.
  |
  */
  metaFiles: [
    {
      pattern: 'resources/views/**/*.edge',
      reloadServer: false,
    },
    {
      pattern: 'public/**',
      reloadServer: false,
    },
    {
      pattern: 'resources/lang/**/*.{json,yaml,yml}',
      reloadServer: false,
    },
    {
      pattern: 'app/modules/**/*.{json,yaml,yml}',
      reloadServer: false,
    },
    {
      pattern: 'app/modules/**/*.edge',
      reloadServer: false,
    },
    {
      pattern: 'app/modules/**/*.{ods,odt,xslx,docx,xml}',
      reloadServer: false,
    },
  ],

  assetsBundler: false,
  unstable_assembler: {
    onBuildStarting: [
      () => import('./hooks/generate_i18n_hook.js'),
      () => import('@adonisjs/vite/build_hook'),
    ],
  },
})
