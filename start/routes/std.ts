import os from 'node:os'
import { statfsSync } from 'node:fs'
import { sep, normalize, join } from 'node:path'

import { middleware } from '#start/kernel'
import { require } from '#start/utils/require'
import { prepareStorage } from '#start/utils/prepare_local_storage'

import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'
import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

const pkg = require('./package.json')

router
  .group(() => {
    router
      .get('/current-version', async ({ response }) => {
        return response.ok({ version: pkg.version })
      })
      .as('current-version')

    router
      .get('/health', async ({ response }) => {
        const dbHealthCheckResult = await db.report()
        const redisHealthCheckResult = await redis.ping()
        const pathToCheck = '/'

        const diskSpace = statfsSync(pathToCheck)
        return response.ok({
          status: {
            app: 'healthy',
            database: dbHealthCheckResult!.health?.healthy ? 'healthy' : 'down',
            redis: redisHealthCheckResult === 'PONG' ? 'healthy' : 'down',
          },
          meta: {
            os: {
              memory: {
                free: os.freemem(),
                total: os.totalmem(),
              },
              disk: {
                space: diskSpace.bsize * diskSpace.bfree,
                available: diskSpace.bsize * diskSpace.bavail,
              },
            },
            redis: {
              dbSize: await redis.dbsize(),
            },
          },
          uptime: Math.round(process.uptime() / 60) + 'm',
        })
      })
      .as('health')
  })
  .as('api.std')
  .prefix('/api/common')
  .middleware([middleware.auth()])

router
  .get('/', async ({ auth, response }) => {
    if (!auth.isAuthenticated) {
      return response.redirect().toRoute('security.auth.login')
    }

    return response.redirect().toRoute('admin.common.dashboard')
  })
  .middleware([middleware.guest()])
  .as('home')

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

function sharedStorageController({ request, response }: HttpContext) {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const isPublic = /\/public\//.test(request.url())

  const storagePath = prepareStorage(isPublic)

  const absolutePath = join(storagePath, normalizedPath)
  return response.download(absolutePath)
}

router.get('/public/*', sharedStorageController).as('storage.public')

router.get('/uploads/*', sharedStorageController).middleware([middleware.auth()]).as('storage')
