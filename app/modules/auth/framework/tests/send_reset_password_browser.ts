import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import mail from '@adonisjs/mail/services/main'

test.group('SendResetPassword', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should not send a reset email when username is invalid', async ({ visit }) => {
    const page = await visit('security/auth/reset/password')

    await page.fill('input[name="username"]', 'invalid@invalid.ao')

    await page.click('button[type="submit"]')

    await page.waitForSelector('div[role="alert"]')

    await page.assertVisible('div[role="alert"]')
  })

  test('should send reset email, when is an valid email', async ({ visit, cleanup }) => {
    mail.fake()

    const page = await visit('security/auth/reset/password')

    await page.fill('input[name="username"]', 'root@mp.co.ao')

    await page.click('button[type="submit"]')

    await page.waitForSelector('div[role="alert"]')

    await page.assertVisible('div[role="alert"]')

    cleanup(() => {
      mail.restore()
    })
  })
})
