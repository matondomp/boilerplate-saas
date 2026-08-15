import { test } from '@japa/runner'
import { dashboardFactory } from '#modules/admin/settings/dashboard_management/framework/infra/db/factories/index'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('List dashboards', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('Should list dashboards', async ({ visit }) => {
    await dashboardFactory.create()

    const dashboardUrl = 'admin/settings/dashboards/manage'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')
    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.waitForURL(dashboardUrl)
    await page.assertUrlContains(dashboardUrl)
    // await page.assertVisible(page.locator('.dashboard'))
  })
})
