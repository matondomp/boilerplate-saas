import { resolve } from 'node:path'

import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

import { installPackage } from '@antfu/install-pkg'

import { loadContext } from '#start/utils/load_context'

type Dep = {
  [k: string]: string
}

type Package = {
  dependencies?: Dep
  devDependencies?: Dep
}

export default class InstallAddonDeps extends BaseCommand {
  static commandName = 'install:addon:deps'
  static description = 'Install all packages deps'

  static options: CommandOptions = {}

  async run() {
    const modules = loadContext(
      resolve(this.app.appRoot.pathname, 'app/modules/addons'),
      true,
      /(module\.json)$/
    )

    const dependencies: Map<string, string> = new Map<string, string>()

    for (const key of modules.keys()) {
      const importedModule = await import(key, { with: { type: 'json' } })
      const packages: Package = importedModule.default

      if (packages.dependencies) {
        for (const k of Object.keys(packages.dependencies)) {
          dependencies.set(k, packages.dependencies[k])
        }
      }

      if (!this.app.inProduction && packages.devDependencies) {
        for (const k of Object.keys(packages.devDependencies)) {
          dependencies.set(k, packages.devDependencies[k])
        }
      }
    }

    const dependenciesRecognizableForPackageManagers = [...dependencies.entries()].map(
      (r) => `${r[0]}@${r[1]}`
    )

    this.logger.info(`Installing deps`)
    await installPackage(dependenciesRecognizableForPackageManagers, {
      cwd: this.app.appRoot.pathname,
      packageManager: 'npm',
      additionalArgs: ['--no-save'],
    })
    this.logger.success('Everything updated!')
  }
}
