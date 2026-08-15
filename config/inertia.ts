import {
  sharedAppDetails,
  sharedUserDetails,
  sharedUserMenu,
} from '#app/utils/inertia_protocol/index'
import env from '#start/env'

import { require } from '#start/utils/require'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/inertia'

const pkg = require('./package.json')

export default defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    copyright: {
      version: pkg.version,
      year: new Date().getFullYear(),
      owner: 'ITGest',
    },
    csrfToken: (ctx) => ctx.request.csrfToken,
    alert: (ctx) => ctx.session.flashMessages.get('alert'),
    alertGlobal: (ctx) => ctx.session.flashMessages.get('alertGlobal'),
    user: sharedUserDetails,
    impersonated: (ctx) => ctx.session.has('@impersonate:userId'),
    env: env.get('IN_STAGING') ? 'STAGING' : app.inProduction ? 'PRODUCTION' : 'LOCAL',
    menu: sharedUserMenu,
    headers: sharedAppDetails,
    i18n: () => {
      return [
        {
          key: 'pt',
          display: 'Português (AO)',
        },
      ]
    },
    dashboardRefreshTime: () => {
      const options = [
        {
          name: '2sec',
          value: 2,
        },
        {
          name: '5sec',
          value: 5,
        },
        {
          name: '10sec',
          value: 10,
        },
        {
          name: '5min',
          value: 60 * 5,
        },
        {
          name: '10min',
          value: 60 * 10,
        },
        {
          name: '30min',
          value: 60 * 30,
        },
        {
          name: '1h',
          value: 60 * 60,
        },
      ]

      return {
        options,
        default: options.find((o) => o.name === '5min'),
      }
    },
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.ts',
  },
})
