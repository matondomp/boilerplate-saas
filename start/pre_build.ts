import { i18nLoader } from './i18n_loader.js'
import { resolve } from 'node:path'

console.log('Generate i18n translations!')

const langPath = resolve(import.meta.dirname, '..', 'resources', 'lang')
const appRoot = resolve(import.meta.dirname, '..')
await i18nLoader(appRoot, langPath)
