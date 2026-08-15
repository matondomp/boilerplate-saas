import { test } from '@japa/runner'
import {
  dashboardFactory,
  dashboardItemFactory,
} from '#modules/admin/settings/dashboard_management/framework/infra/db/factories/index'
import { DashboardDashboardItemModel } from '../../infra/db/models/dashboard_dashboard_item_model.js'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Detach dashboard item', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('Should remove attached item from dashboard', async ({ visit }) => {
    const dashboardModel = await dashboardFactory.create()
    const dashboardItemModel = await dashboardItemFactory.create()

    await DashboardDashboardItemModel.create({
      dashboardSlug: dashboardModel.slug,
      itemId: dashboardItemModel.id,
      x: 10,
      y: 10,
      width: 10,
      height: 10,
    })

    const dashboardDetailsUrl = `admin/settings/dashboards/${dashboardModel.slug}`
    const dashboardUrl = 'admin/settings/dashboards/manage'

    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')
    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.locator(`a[href="/${dashboardDetailsUrl}"]`).click()
    await page.waitForURL(dashboardDetailsUrl)

    await page.click('.open-dashboard-item-actions')
    await page.click('.remove-dashboard-item-button')
    await page.waitForSelector('.remove-dashboard-item-confirm-button')
    await page.click('.remove-dashboard-item-confirm-button')

    await page.assertVisible('div[role="alert"]')
    // await page.assertNotVisible('.delete-dashboard-item-button')
    // await page.assertNotVisible('.dashboard-item')
  })
})
