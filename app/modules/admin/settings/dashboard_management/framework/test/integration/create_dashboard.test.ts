import { test } from '@japa/runner'
import { DashboardModel } from '../../infra/db/models/index.js'
import testUtils from '@adonisjs/core/services/test_utils'
import { CoreUserModel } from '#modules/shared/framework/infra/index'

let userModel: CoreUserModel

test.group('Dashboard creation', (group) => {
  group.each.setup(async () => {
    await testUtils.db().withGlobalTransaction()
    userModel = (await CoreUserModel.query().first()) as CoreUserModel
  })

  test('Should create dashboard', async ({ assert, client }) => {
    const dashboard = {
      name: 'valid name',
      description: 'valid_description',
    }

    const { response } = await client
      .post('/api/account/admin/settings/dashboards/create')
      .json(dashboard)
      .withCsrfToken()
      .loginAs(userModel)

    const dashboardEntity = await DashboardModel.query().where('name', dashboard.name)
    assert.equal(response.statusCode, 200)
    assert.exists(dashboardEntity)
  })

  test('Should not allow unauthorized user create a dashboard', async ({ assert, client }) => {
    const { response } = await client
      .post('/api/account/admin/settings/dashboards/create')
      .withCsrfToken()

    assert.equal(response.statusCode, 401)
  })

  test('Should not create a dashboard with field name empty', async ({ assert, client }) => {
    const dashboard = {
      name: '',
      description: 'validating-name',
    }

    await client
      .post('/api/account/admin/settings/dashboards/create')
      .json(dashboard)
      .loginAs(userModel)
      .withCsrfToken()

    const dashboardEntity = await DashboardModel.query()
      .where('description', dashboard.description)
      .first()
    assert.notExists(dashboardEntity)
  })

  test('Should not create a dashboard with field description empty', async ({ assert, client }) => {
    const dashboard = {
      name: 'validating-description',
      description: '',
    }

    await client
      .post('/api/account/admin/settings/dashboards/create')
      .json(dashboard)
      .loginAs(userModel)
      .withCsrfToken()

    const dashboardEntity = await DashboardModel.query().where('name', dashboard.name).first()
    assert.notExists(dashboardEntity)
  })
})
