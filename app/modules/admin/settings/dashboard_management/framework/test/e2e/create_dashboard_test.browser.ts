import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'

test.group('Create dashboard', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('Should create a dashboard', async ({ visit }) => {
    const dashboard = {
      name: 'valid-name',
      description: 'valid-description',
    }

    const dashboardUrl = 'admin/settings/dashboards/manage'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.waitForURL(dashboardUrl)

    await page.click('#open-create-edit-dashboard-modal')
    await page.fill('input[name="name"]', dashboard.name)
    await page.fill('#dashboard-description', dashboard.description)
    await page.click('#create-update-dashboard-button')
  })

  test('Should create then redirect to created dashboard', async ({ visit }) => {
    const dashboard = {
      name: 'valid-name-redirect',
      description: 'valid-description-redirect',
    }

    const dashboardUrl = 'admin/settings/dashboards/manage'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    await page.click(`a[href="/${dashboardUrl}"]`)
    await page.waitForURL(dashboardUrl)

    await page.click('#open-create-edit-dashboard-modal')
    await page.fill('input[name="name"]', dashboard.name)
    await page.fill('#dashboard-description', dashboard.description)
    await page.click('#create-dashboard-then-redirect')
    await page.waitForURL(`admin/settings/dashboards/${dashboard.name}`)
    await page.assertUrlContains(`admin/settings/dashboards/${dashboard.name}`)
  })
})
