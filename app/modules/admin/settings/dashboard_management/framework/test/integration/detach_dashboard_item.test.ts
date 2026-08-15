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

test.group('Dashboard item detachment', (group) => {
  group.each.setup(async () => {
    await testUtils.db().withGlobalTransaction()
    userModel = (await CoreUserModel.query().first()) as CoreUserModel
  })

  test('Should detach an item from a dashboard', async ({ assert, client }) => {
    const itemProps = getFakeOldItemProps()

    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()
    const url = `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`

    await client.post(url).json(itemProps).loginAs(userModel).withCsrfToken()

    const { response } = await client.delete(url).json(itemProps).loginAs(userModel).withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)

    assert.equal(response.statusCode, 200)
    assert.empty(entitiesAttachment!.items)
  })

  test('Should not allow unauthorized user detach an item from a dashboard', async ({
    assert,
    client,
  }) => {
    const { response } = await client
      .delete('/api/account/admin/settings/dashboards/any_slug/items/any_id')
      .withCsrfToken()

    assert.equal(response.statusCode, 401)
  })

  test('Should not detach an item from a not found dashboard', async ({ assert, client }) => {
    const itemProps = getFakeOldItemProps()

    const dashboardItemEntity = await dashboardItemFactory.create()
    const dashboardEntity = await dashboardFactory.create()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    await client
      .delete(`/api/account/admin/settings/dashboards/any_slug/items/${dashboardItemEntity!.id}`)
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)
    assert.notEmpty(entitiesAttachment!.items)
  })

  test('Should not detach a not found item from a dashboard', async ({ assert, client }) => {
    const itemProps = getFakeOldItemProps()

    const dashboardItemEntity = await dashboardItemFactory.create()
    const dashboardEntity = await dashboardFactory.create()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    await client
      .delete(`/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/any_id`)
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await queryDashboardWithItems(dashboardEntity.slug)
    assert.notEmpty(entitiesAttachment!.items)
  })
})
