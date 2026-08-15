import { resolve } from 'node:path'
import { loadContext as context } from './load_context.js'

import { writeFile } from 'node:fs/promises'

export const loadModulesInternationalization = async (
  path: string,
  destine: string,
  regex: any
) => {
  const req = context(path, true, regex)

  const languages: string[] = []
  const languagesData: { [key: string]: Object } = {}

  for (const filename of req.keys()) {
    languages.push(filename)
  }

  for (const lang of languages) {
    const split = lang.split('/')
    const last = split[split.length - 1].split('.')[0]

    const importedModule = await import(lang, { with: { type: 'json' } })
    const data = importedModule.default

    if (!languagesData[last]) {
      languagesData[last] = {}
    }

    languagesData[last] = {
      ...languagesData[last],
      ...data,
    }
  }

  for (const lang in languagesData) {
    await writeFile(resolve(destine, `${lang}.json`), JSON.stringify(languagesData[lang]))
  }
}
