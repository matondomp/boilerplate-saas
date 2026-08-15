import { test } from '@japa/runner'
import { slugifyAdapter } from './slugify_adapter_impl.js'
import { RoleFactory } from '#shared/framework/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('SlugifyAdapter', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should generate a new slug', async ({ assert }) => {
    const slug = await slugifyAdapter('Valid Test', {
      fieldName: 'slug',
      tableName: 'core_roles',
    })

    assert.equal(slug, 'valid-test')
  })

  test('should generate a new slug adding 1 to the end', async ({ assert }) => {
    const role = await RoleFactory.merge({
      name: 'Acidiney Dias',
      slug: 'acidiney-dias',
    }).create()
    const slug = await slugifyAdapter(role.name, {
      fieldName: 'slug',
      tableName: 'core_roles',
    })

    assert.equal(slug, 'acidiney-dias-1')
  })

  test('should sum the last number in slug', async ({ assert }) => {
    const role = await RoleFactory.merge({
      name: 'Acidiney Dias',
      slug: 'acidiney-dias-1',
    }).create()
    const slug = await slugifyAdapter(role.name, {
      fieldName: 'slug',
      tableName: 'core_roles',
    })

    assert.equal(slug, 'acidiney-dias-2')
  })

  test('should use only the number and not the text ', async ({ assert }) => {
    const role = await RoleFactory.merge({
      name: 'Acidiney Dias',
      slug: 'acidiney-dias-1',
    }).create()

    await RoleFactory.merge({
      name: 'Acidiney Dias',
      slug: 'acidiney-dias-ok',
    }).create()

    const slug = await slugifyAdapter(role.name, {
      fieldName: 'slug',
      tableName: 'core_roles',
    })

    assert.equal(slug, 'acidiney-dias-2')
  })

  test('should sum the the greatest number ', async ({ assert }) => {
    const role = await RoleFactory.merge({
      name: 'Acidiney Dias',
      slug: 'acidiney-dias-1',
    }).create()

    await RoleFactory.merge({
      name: 'Acidiney Dias',
      slug: 'acidiney-dias-9',
    }).create()

    await RoleFactory.merge({
      name: 'Acidiney Dias',
      slug: 'acidiney-dias-3',
    }).create()
    const slug = await slugifyAdapter(role.name, {
      fieldName: 'slug',
      tableName: 'core_roles',
    })

    assert.equal(slug, 'acidiney-dias-10')
  })
})
