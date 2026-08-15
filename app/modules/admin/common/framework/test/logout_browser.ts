import { test } from '@japa/runner'
import { UserFactory } from '#shared/framework/test/factories/user_factory'

test.group('Logout Browser', () => {
  test('should logout an authenticated user', async ({ visit }) => {
    const password = '12345678'
    const user = await UserFactory.with('role').merge({ password }).create()

    const page = await visit('security/auth/login')
    await page.fill('input[name="username"]', user.email)
    await page.fill('input[name="password"]', password)

    await page.click('button[type="submit"]')
    await page.waitForURL('account/dashboard')

    await page.click('#user-menu-button')
    await page.waitForSelector('#button-logout')
    await page.click('#button-logout')

    await page.waitForURL('/security/auth/login')
    await page.assertUrlContains('/security/auth/login')
    await page.assertVisible('div[role="alert"]')
  })
})
