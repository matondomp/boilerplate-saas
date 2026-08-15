import { test } from '@japa/runner'
import { Chart } from '#modules/admin/settings/dashboard_management/domain/types/chart_types'
import { DashboardItemModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Dashboard item creation', (group) => {
  group.each.setup(async () => {
    await testUtils.db().withGlobalTransaction()
  })

  test('Should create a dashboard item', async ({ assert }) => {
    const item = {
      name: 'valid name',
      sqlRaw: 'valid_sql',
      chartType: Chart.PIZZA,
    }

    await DashboardItemModel.create(item)
    const createdItem = await DashboardItemModel.query().where('slug', 'valid-name').first()

    assert.notEmpty(createdItem)
    assert.equal(item.name, createdItem!.name)
    assert.equal(item.chartType, createdItem!.chartType)
    assert.equal(item.sqlRaw, createdItem!.sqlRaw)
    assert.equal('valid-name', createdItem!.slug)
  })
})
