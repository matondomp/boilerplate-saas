import { i18nLoader } from '#start/i18n_loader'
import app from '@adonisjs/core/services/app'
import { AssemblerHookHandler } from '@adonisjs/core/types/app'

const buildHook: AssemblerHookHandler = async ({ logger }) => {
  await i18nLoader(app.appRoot.pathname, app.languageFilesPath())

  logger.info('i18n loaded successfully')
}

export default buildHook
