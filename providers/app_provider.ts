import { mongodb } from '#app/db/mongodb/index'
import {
  installIndexOnCoreNotificationEventModel,
  installIndexesOnCoreUserActivity,
} from '#shared/framework/infra/index'
import { i18nLoader } from '#start/i18n_loader'
import type { ApplicationService } from '@adonisjs/core/types'
import * as Sentry from '@sentry/node'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    await i18nLoader(this.app.appRoot.pathname, this.app.languageFilesPath())
  }

  /**
   * The application has been booted
   */
  async start() {
    await mongodb.connect()
  }

  /**
   * The process has been started
   */
  async ready() {
    await Promise.allSettled([
      installIndexOnCoreNotificationEventModel(),
      installIndexesOnCoreUserActivity(),
    ])
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    await mongodb.disconnect()
    await Sentry.close(2000)

    process.exit(0)
  }
}
