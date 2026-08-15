import { test } from '@japa/runner'
import { dashboardItemFactory } from '#modules/admin/settings/dashboard_management/framework/infra/db/factories/index'
import testUtils from '@adonisjs/core/services/test_utils'
import { DashboardItemModel } from '../../infra/db/models/dashboard_item_model.js'

test.group('Dashboard item list', (group) => {
  group.each.setup(async () => {
    await testUtils.db().withGlobalTransaction()
  })
  test('Should created dashboard items', async ({ assert }) => {
    const item1 = await dashboardItemFactory.create()
    const item2 = await dashboardItemFactory.create()

    const items = await DashboardItemModel.query()
    const createdItem1 = await DashboardItemModel.query().where('id', item1.id)
    const createdItem2 = await DashboardItemModel.query().where('id', item2.id)

    assert.notEmpty(items)
    assert.exists(createdItem1)
    assert.exists(createdItem2)
  })
})
