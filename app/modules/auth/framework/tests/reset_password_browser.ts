import { test } from '@japa/runner'
import { CoreUserModel } from '#shared/framework/infra/index'
import { TokenFactory } from '../infra/db/factories/index.js'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('ResetPassword', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should not be able to reset password with wrong token', async ({ visit }) => {
    const page = await visit('security/auth/reset/password/not-found-token')

    await page.fill('input[name="password"]', '12345678')
    await page.fill('input[name="confirm_password"]', '12345678')

    await page.click('button[type="submit"]')

    await page.waitForSelector('div[role="alert"]')

    await page.assertVisible('div[role="alert"]')
  })

  test('should not allow to reset password using an expired token', async ({ visit }) => {
    const userModel = await CoreUserModel.query().where('email', 'root@mp.co.ao').firstOrFail()

    const tokenModel = await TokenFactory.merge({ tokenableId: userModel.id })
      .apply('expired')
      .create()

    const page = await visit(`security/auth/reset/password/${tokenModel.hash}`)

    await page.fill('input[name="password"]', '12345678')
    await page.fill('input[name="confirm_password"]', '12345678')

    await page.click('button[type="submit"]')

    await page.waitForSelector('div[role="alert"]')

    await page.assertVisible('div[role="alert"]')
  })

  test('should allow to reset password with a valid token', async ({ visit }) => {
    const userModel = await CoreUserModel.query().where('email', 'root@mp.co.ao').firstOrFail()

    const tokenModel = await TokenFactory.merge({ tokenableId: userModel.id }).create()

    const page = await visit(`security/auth/reset/password/${tokenModel.hash}`)

    await page.fill('input[name="password"]', '12345678')
    await page.fill('input[name="confirm_password"]', '12345678')

    await page.click('button[type="submit"]')

    await page.waitForSelector('div[role="alert"]')

    await page.assertVisible('div[role="alert"]')
  })
})
