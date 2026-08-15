import {
  dashboardFactory,
  dashboardItemFactory,
} from '#modules/admin/settings/dashboard_management/framework/infra/db/factories/index'
import { test } from '@japa/runner'
import { getFakeOldItemProps } from '../utils/item_props.js'
import testUtils from '@adonisjs/core/services/test_utils'
import { queryDashboardWithItems } from '../utils/dashboard_query.js'
import { CoreUserModel } from '#modules/shared/framework/infra/index'

let userModel: CoreUserModel

test.group('Dashboard item attachment', (group) => {
  group.each.setup(async () => {
    await testUtils.db().withGlobalTransaction()
    userModel = (await CoreUserModel.query().first()) as CoreUserModel
  })

  test('Should attach an item to a dashboard', async ({ assert, client }) => {
    const itemProps = getFakeOldItemProps()

    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()

    const { response } = await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)

    assert.equal(response.statusCode, 200)
    assert.exists(entitiesAttachment)
    assert.notEmpty(entitiesAttachment!.items)
  })

  test('Should not allow unauthorized user to attach an item to a dashboard', async ({
    assert,
    client,
  }) => {
    const { response } = await client
      .post('/api/account/admin/settings/dashboards/any_slug/items/any_id')
      .withCsrfToken()

    assert.equal(response.statusCode, 401)
  })

  test('Should not attach an item to a not found dashboard', async ({ assert, client }) => {
    const itemProps = getFakeOldItemProps()
    const dashboardSlug = 'any_slug'

    const dashboardItemEntity = await dashboardItemFactory.create()
    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardSlug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardSlug)
    assert.notExists(entitiesAttachment)
  })

  test('Should not attach a not found item to a dashboard', async ({ assert, client }) => {
    const dashboardEntity = await dashboardFactory.create()

    await client
      .post(`/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/any_id`)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)
    assert.empty(entitiesAttachment!.items)
  })

  test('Should not attach an item without itemProps to a dashboard', async ({ assert, client }) => {
    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)
    assert.empty(entitiesAttachment!.items)
  })

  test('Should not attach an item without width to a dashboard', async ({ assert, client }) => {
    const itemProps = {
      height: 30,
      x: 40,
      y: 40,
    }

    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)
    assert.empty(entitiesAttachment!.items)
  })

  test('Should not attach an item without height to a dashboard', async ({ assert, client }) => {
    const itemProps = {
      width: 30,
      x: 40,
      y: 40,
    }

    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)
    assert.empty(entitiesAttachment!.items)
  })

  test('Should not attach an item without x to a dashboard', async ({ assert, client }) => {
    const itemProps = {
      width: 30,
      height: 30,
      y: 40,
    }

    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)
    assert.empty(entitiesAttachment!.items)
  })

  test('Should not attach an item without y to a dashboard', async ({ assert, client }) => {
    const itemProps = {
      width: 30,
      height: 30,
      x: 40,
    }

    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)
    assert.empty(entitiesAttachment!.items)
  })
})
