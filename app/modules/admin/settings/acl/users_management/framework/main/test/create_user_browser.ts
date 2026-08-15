import { CoreRoleModel } from '#shared/framework/infra/index'
import { UserFactory } from '#shared/framework/test/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'

test.group('Create User', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should create a new user', async ({ visit }) => {
    const adminRole = await CoreRoleModel.findByOrFail('slug', 'admin')

    const user = await UserFactory.merge({
      password: '12345678',
      roleId: adminRole.id,
    }).create()

    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', user.email)
    await page.fill('input[name="password"]', '12345678')

    await page.click('button[type="submit"]')

    await page.waitForURL('account/dashboard')

    await page.click('a[href="/account/admin/settings/acl/users"]')

    await page.waitForURL('/account/admin/settings/acl/users')

    await page.click('#btn-create-user')

    await page.fill('input[name="first_name"]', faker.person.firstName('female'))
    await page.fill('input[name="last_name"]', faker.person.lastName('female'))
    await page.fill('input[name="email"]', faker.internet.email())
    await page.selectOption('#listbox-button', 'admin')

    await page.waitForTimeout(50000)
  })
})
