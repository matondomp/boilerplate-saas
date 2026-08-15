import {
  dashboardFactory,
  dashboardItemFactory,
} from '#modules/admin/settings/dashboard_management/framework/infra/db/factories/index'
import { test } from '@japa/runner'
import { getFakeNewItemProps, getFakeOldItemProps } from '../utils/item_props.js'
import testUtils from '@adonisjs/core/services/test_utils'
import { CoreUserModel } from '#modules/shared/framework/infra/index'
import { DashboardDashboardItemModel } from '../../infra/db/models/dashboard_dashboard_item_model.js'

let userModel: CoreUserModel

test.group('Dashboard item update', (group) => {
  group.each.setup(async () => {
    await testUtils.db().withGlobalTransaction()
    userModel = (await CoreUserModel.query().first()) as CoreUserModel
  })

  test('Should update a dashboard item coordinates', async ({ assert, client }) => {
    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()
    const itemProps = getFakeOldItemProps()
    const newItemProps = getFakeNewItemProps()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    const { response } = await client
      .put('/api/account/admin/settings/dashboards/items')
      .json({
        items: [
          {
            dashboardSlug: dashboardEntity.slug,
            itemId: dashboardItemEntity!.id,
            ...newItemProps,
          },
        ],
      })
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await DashboardDashboardItemModel.query()
      .where('dashboardSlug', dashboardEntity.slug)
      .andWhere('itemId', dashboardItemEntity!.id)
      .first()

    assert.equal(response.statusCode, 200)
    assert.equal(entitiesAttachment!.width, newItemProps.width)
    assert.equal(entitiesAttachment!.height, newItemProps.height)
    assert.equal(entitiesAttachment!.x, newItemProps.x)
    assert.equal(entitiesAttachment!.y, newItemProps.y)
  })

  test('Should not allow unauthorized user update a dashboard item coordinate', async ({
    assert,
    client,
  }) => {
    const { response } = await client
      .put('/api/account/admin/settings/dashboards/items')
      .withCsrfToken()

    assert.equal(response.statusCode, 401)
  })

  test('Should not update an item coordinate with a not found dashboard', async ({
    assert,
    client,
  }) => {
    const dashboardItemEntity = await dashboardItemFactory.create()
    const dashboardEntity = await dashboardFactory.create()
    const itemProps = getFakeOldItemProps()
    const newItemProps = getFakeNewItemProps()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    await client
      .put('/api/account/admin/settings/dashboards/items')
      .json({
        items: [
          {
            itemId: dashboardItemEntity!.id,
            ...newItemProps,
          },
        ],
      })
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await DashboardDashboardItemModel.query()
      .where('dashboardSlug', dashboardEntity.slug)
      .andWhere('itemId', dashboardItemEntity!.id)
      .first()

    assert.equal(entitiesAttachment!.width, itemProps.width)
    assert.equal(entitiesAttachment!.height, itemProps.height)
    assert.equal(entitiesAttachment!.x, itemProps.x)
    assert.equal(entitiesAttachment!.y, itemProps.y)
  })

  test('Should not update an item coordinate with a not found item', async ({ assert, client }) => {
    const dashboardItemEntity = await dashboardItemFactory.create()
    const dashboardEntity = await dashboardFactory.create()
    const itemProps = getFakeOldItemProps()
    const newItemProps = getFakeNewItemProps()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    await client
      .put('/api/account/admin/settings/dashboards/items')
      .json({
        items: [
          {
            dashboardSlug: dashboardEntity!.slug,
            ...newItemProps,
          },
        ],
      })
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await DashboardDashboardItemModel.query()
      .where('dashboardSlug', dashboardEntity.slug)
      .andWhere('itemId', dashboardItemEntity!.id)
      .first()

    assert.equal(entitiesAttachment!.width, itemProps.width)
    assert.equal(entitiesAttachment!.height, itemProps.height)
    assert.equal(entitiesAttachment!.x, itemProps.x)
    assert.equal(entitiesAttachment!.y, itemProps.y)
  })

  test('Should not update an item coordinates without width', async ({ assert, client }) => {
    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()
    const itemProps = getFakeOldItemProps()
    const newItemProps = getFakeNewItemProps()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    await client
      .put('/api/account/admin/settings/dashboards/items')
      .json({
        items: [
          {
            dashboardSlug: dashboardEntity.slug,
            itemId: dashboardItemEntity!.id,
            ...{
              ...newItemProps,
              width: undefined,
            },
          },
        ],
      })
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await DashboardDashboardItemModel.query()
      .where('dashboardSlug', dashboardEntity.slug)
      .andWhere('itemId', dashboardItemEntity!.id)
      .first()

    assert.equal(entitiesAttachment!.width, itemProps.width)
    assert.equal(entitiesAttachment!.height, itemProps.height)
    assert.equal(entitiesAttachment!.x, itemProps.x)
    assert.equal(entitiesAttachment!.y, itemProps.y)
  })

  test('Should not update an item coordinates without height', async ({ assert, client }) => {
    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()
    const itemProps = getFakeOldItemProps()
    const newItemProps = getFakeNewItemProps()

    await client
      .post(
        `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
      )
      .json(itemProps)
      .loginAs(userModel)
      .withCsrfToken()

    await client
      .put('/api/account/admin/settings/dashboards/items')
      .json({
        items: [
          {
            dashboardSlug: dashboardEntity.slug,
            itemId: dashboardItemEntity!.id,
            ...{
              ...newItemProps,
              height: undefined,
            },
          },
        ],
      })
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await DashboardDashboardItemModel.query()
      .where('dashboardSlug', dashboardEntity.slug)
      .andWhere('itemId', dashboardItemEntity!.id)
      .first()

    assert.equal(entitiesAttachment!.width, itemProps.width)
    assert.equal(entitiesAttachment!.height, itemProps.height)
    assert.equal(entitiesAttachment!.x, itemProps.x)
    assert.equal(entitiesAttachment!.y, itemProps.y)
  })

  test('Should not update an item coordinates without x', async ({ assert, client }) => {
    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()
    const url = `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
    const itemProps = getFakeOldItemProps()
    const newItemProps = getFakeNewItemProps()

    await client.post(url).json(itemProps).loginAs(userModel).withCsrfToken()

    await client
      .put('/api/account/admin/settings/dashboards/items')
      .json({
        items: [
          {
            dashboardSlug: dashboardEntity.slug,
            itemId: dashboardItemEntity!.id,
            ...{
              ...newItemProps,
              x: undefined,
            },
          },
        ],
      })
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await DashboardDashboardItemModel.query()
      .where('dashboardSlug', dashboardEntity.slug)
      .andWhere('itemId', dashboardItemEntity.id)
      .first()

    assert.equal(entitiesAttachment!.width, itemProps.width)
    assert.equal(entitiesAttachment!.height, itemProps.height)
    assert.equal(entitiesAttachment!.x, itemProps.x)
    assert.equal(entitiesAttachment!.y, itemProps.y)
  })

  test('Should not update an item coordinates without y', async ({ assert, client }) => {
    const dashboardEntity = await dashboardFactory.create()
    const dashboardItemEntity = await dashboardItemFactory.create()
    const url = `/api/account/admin/settings/dashboards/${dashboardEntity!.slug}/items/${dashboardItemEntity!.id}`
    const itemProps = getFakeOldItemProps()
    const newItemProps = getFakeNewItemProps()

    await client.post(url).json(itemProps).loginAs(userModel).withCsrfToken()

    await client
      .put('/api/account/admin/settings/dashboards/items')
      .json({
        items: [
          {
            dashboardSlug: dashboardEntity.slug,
            itemId: dashboardItemEntity!.id,
            ...{
              ...newItemProps,
              y: undefined,
            },
          },
        ],
      })
      .loginAs(userModel)
      .withCsrfToken()

    const entitiesAttachment = await DashboardDashboardItemModel.query()
      .where('dashboardSlug', dashboardEntity.slug)
      .andWhere('itemId', dashboardItemEntity!.id)
      .first()

    assert.equal(entitiesAttachment!.width, itemProps.width)
    assert.equal(entitiesAttachment!.height, itemProps.height)
    assert.equal(entitiesAttachment!.x, itemProps.x)
    assert.equal(entitiesAttachment!.y, itemProps.y)
  })
})
