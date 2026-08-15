import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Authentication', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should not logged-in with wrong credentials', async ({ visit }) => {
    const page = await visit('security/auth/login')

    await page.fill('input[name="username"]', 'invalid@invalid.ao')
    await page.fill('input[name="password"]', '12345678')

    await page.click('button[type="submit"]')

    await page.waitForSelector('div[role="alert"]')

    await page.assertVisible('div[role="alert"]')
  })

  test('should logged-in', async ({ visit }) => {
    const page = await visit('security/auth/login')
    await page.fill('input[name="username"]', 'root@mp.co.ao')
    await page.fill('input[name="password"]', '12345678')

    await page.click('button[type="submit"]')

    await page.waitForURL('account/dashboard')

    await page.assertUrlContains('account/dashboard')
  })
})
