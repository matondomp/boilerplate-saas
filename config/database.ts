import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import { loadDirectories } from '#start/utils/directories'
import Application from '@adonisjs/core/services/app'
import { resolve } from 'node:path'

const migrations = loadDirectories(resolve(Application.appRoot.pathname, 'app/modules'))
  .filter((path) => path.includes('db/'))
  .filter((path) => path.includes('migrations'))
  .map((k) => {
    return k.replace(Application.appRoot.pathname, '')
  })

const sharedMigrationPath = migrations.filter((path) => path.includes('app/modules/shared/'))

const addonsMigrationPath = migrations.filter((path) => path.includes('app/modules/addons/'))

const seeders = loadDirectories(resolve(Application.appRoot.pathname, 'app/modules'))
  .filter((path) => path.includes('db/'))
  .filter((path) => path.includes('seeders'))
  .map((k) => {
    return k.replace(Application.appRoot.pathname, '')
  })

const sharedSeederPath = seeders.filter((path) => path.includes('app/modules/shared/'))

const addonsSeederPath = seeders.filter((path) => path.includes('app/modules/addons/'))

const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: [
          'database/migrations',
          ...sharedMigrationPath,
          ...migrations
            .filter((path) => !path.includes('app/modules/shared'))
            .filter((path) => !path.includes('app/modules/addons')),
          ...addonsMigrationPath,
        ],
        disableRollbacksInProduction: true,
        tableName: 'core_schemas',
      },
      seeders: {
        paths: [
          ...sharedSeederPath,
          ...seeders
            .filter((path) => !path.includes('app/modules/shared'))
            .filter((path) => !path.includes('app/modules/addons')),
          ...addonsSeederPath,
        ],
      },
      debug: true,
    },
  },
})

export default dbConfig
