import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { resolve } from 'node:path'
import { loadContext } from '#start/utils/load_context'

import ace from '@adonisjs/core/services/ace'

export default class DatabaseSyncronize extends BaseCommand {
  static commandName = 'db:sync'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  private difference = (arr1: string[], arr2: string[]) => arr1.filter((x) => !arr2.includes(x))

  async run() {
    const modulesSeeders = loadContext(
      resolve(this.app.appRoot.pathname, './app/modules'),
      true,
      /infra\/db\/(.*\/seeders|seeders)\/.*\.(ts|js)$/
    )

    const seedNames = modulesSeeders.keys().map((k: string) => {
      return k.replace(this.app.appRoot.pathname, './')
    })

    const { CoreDbSyncModel } = await import('#shared/framework/infra/db/models/index')

    const executedSeeds = await CoreDbSyncModel.query().exec()
    const executedSeedNames = executedSeeds.map((seed: { seedName: string }) => seed.seedName)

    let difference: string[] = []

    this.logger.info('Comparing seeders')

    difference = this.difference(seedNames, executedSeedNames)

    this.logger.success('Comparing seeders')

    this.logger.info('Run difference seeds')
    if (!difference.length) {
      this.logger.success('Skipped')
      return
    }

    let currentSeed: string = ''

    const sharedSeederPath = difference.filter((path) => path.includes('app/modules/shared/'))

    const workDifference = difference.filter((path) => !path.includes('app/modules/shared/'))

    workDifference.unshift(...sharedSeederPath)

    try {
      for (const seedName of workDifference) {
        currentSeed = seedName

        const result = await ace.exec('db:seed', [
          '',
          `--files=${seedName.replace('.ts', '').replace('.js', '')}`,
        ])

        await CoreDbSyncModel.create({
          seedName,
        })

        await result
      }
      this.logger.success('Run difference seeds')
    } catch (e) {
      console.log(e)
      await CoreDbSyncModel.query()
        .where({
          seedName: currentSeed,
        })
        .delete()
      this.logger.error(new Error('Não foi possível realizar seed de ' + currentSeed).message)
      throw e
    }
  }
}
