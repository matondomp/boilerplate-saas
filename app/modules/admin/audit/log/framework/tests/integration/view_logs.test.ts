import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { CoreAppLogs } from '../../infra/db/models/core_app_logs.js'
import { randomUUID } from 'node:crypto'

test.group('View logs', (group) => {
  group.each.setup(async () => {
    await testUtils.db().withGlobalTransaction()
  })

  group.teardown(async () => {
    await CoreAppLogs.deleteMany()
  })

  test('Should list logs', async ({ assert }) => {
    const userId = randomUUID()

    await CoreAppLogs.insertOne({
      title: 'Some title',
      source: 'Some source',
      username: 'username',
      fullLog: {},
      summary: 'Some summary',
      success: true,
      userId,
      createdAt: new Date(),
      hash: randomUUID(),
    })

    const logs = await CoreAppLogs.find()
    const createdLog = await CoreAppLogs.find({ userId })

    assert.notEmpty(logs)
    assert.exists(createdLog)
  })
})
