import { test } from '@japa/runner'
import { dashboardFactory } from '#modules/admin/settings/dashboard_management/framework/infra/db/factories/index'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Update dashboard', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })
  test('Should update a dashboard', async ({ visit }) => {
    await dashboardFactory.create()

    const dashboardUrl = 'admin/settings/dashboards/manage'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.waitForURL(dashboardUrl)

    await page.click('.open-dashboard-actions')
    await page.click('.update-dashboard-button')

    await page.fill('input[name="name"]', 'valid_name')
    await page.fill('#dashboard-description', 'valid_description')
    await page.click('#create-update-dashboard-button')
    await page.assertVisible('div[role="alert"]')
  })

  test('Should not update a dashboard with a name that already exists', async ({ visit }) => {
    await dashboardFactory.create()

    const dashboardUrl = 'admin/settings/dashboards/manage'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.waitForURL(dashboardUrl)

    await page.click('.open-dashboard-actions')
    await page.click('.update-dashboard-button')
    await page.click('#create-update-dashboard-button')
  })
})
