import { dashboardFactory } from '#modules/admin/settings/dashboard_management/framework/infra/db/factories/index'
import { test } from '@japa/runner'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Set default dashboard', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })
  test('Should set a dashboard as default', async ({ visit }) => {
    await dashboardFactory.create()

    const dashboardUrl = 'admin/settings/dashboards/manage'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.waitForURL(dashboardUrl)

    await page.click('.open-dashboard-actions')
    await page.click('.set-default-dashboard-button')
    await page.click('.set-default-dashboard-confirm-button')

    await page.assertVisible('div[role="alert"]')
  })
})
