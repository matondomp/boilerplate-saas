import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import execCommand from '#start/utils/exec_command'
import app from '@adonisjs/core/services/app'

test.group('Run migrations test', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should run all migrations', async () => {
    await execCommand('node ace migration:run', {
      cwd: app.appRoot,
    })
  })

  test('should do rollback all migrations', async () => {
    await execCommand('node ace migration:rollback', {
      cwd: app.appRoot,
    })
  })
})
