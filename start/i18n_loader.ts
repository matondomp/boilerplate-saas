export const i18nLoader = async function (dirname: string, destine: string) {
  const { resolve } = await import('node:path')
  const { loadModulesInternationalization } = await import('./utils/i18n_modules_loader.js')

  const paths = ['app/modules']

  for (const path of paths) {
    await loadModulesInternationalization(resolve(dirname, path), destine, /\i18n\/.*\.json$/)
  }
}
