import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Authentication::[Api]', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should not logged-in with wrong credentials', async ({ client }) => {
    const response = await client.post('/api/security/auth/login').json({
      username: 'invalid@invalid.ao',
      password: '12345678',
    })
    response.assertStatus(401)
  })
  test('should logged-in', async ({ client }) => {
    const response = await client.post('/api/security/auth/login').json({
      username: 'root@mp.co.ao',
      password: '12345678',
    })
    response.assertStatus(200)
  })
})
