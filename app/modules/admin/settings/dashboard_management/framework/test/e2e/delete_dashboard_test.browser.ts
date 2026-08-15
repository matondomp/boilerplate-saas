import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'
import { test } from '@japa/runner'
import { dashboardFactory } from '#modules/admin/settings/dashboard_management/framework/infra/db/factories/index'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Delete dashboard', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('Should delete a dashboard', async ({ visit }) => {
    await dashboardFactory.create()
    const dashboardUrl = 'admin/settings/dashboards/manage'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.waitForURL(dashboardUrl)

    await page.click('.open-dashboard-actions')
    await page.click('.delete-dashboard-button')
    await page.click('.delete-dashboard-confirm-button')

    await page.assertVisible('div[role="alert"]')
    // await page.assertNotVisible(page.getByText(dashboard.name))
  })

  test('Should not delete a dashboard when its the main/default', async ({ visit }) => {
    const dashboard = await dashboardFactory.create()
    await DashboardModel.query().where('slug', dashboard.slug).update({ isDefault: true })

    const dashboardUrl = 'admin/settings/dashboards/manage'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.waitForURL(dashboardUrl)

    await page.click('.open-dashboard-actions')
    await page.click('.delete-dashboard-button')
    await page.click('.delete-dashboard-confirm-button')

    await page.assertVisible('div[role="alert"]')
    // await page.assertVisible(page.getByText(dashboard.name))
  })
})
