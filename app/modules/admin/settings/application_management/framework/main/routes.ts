import { routeAdapter } from '#app/adapters/route_adapter'
import {
  makePersistAppSettingControllerFactory,
  makeShowAppSettingFactory,
} from './factories/index.js'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
router
  .group(() => {
    router
      .get('/', ({ response }) => {
        return response.redirect('/account/dashboard')
      })
      .as('index')

    router
      .get(
        '/application',
        routeAdapter(makeShowAppSettingFactory(), {
          operation: 'account-view-settings-color-page',
          description: '[Admin->Settings->Application] View  Setting Color Page',
        })
      )
      .as('view.edit.application')
      .middleware(middleware.can('admin-setup-application'))

    router
      .put(
        '/app-settings',
        routeAdapter(
          makePersistAppSettingControllerFactory(),
          {
            operation: 'admin-acl-create-app-settings',
            description: '[Admin->Settings->Application] Create a app settings',
          },
          false
        )
      )
      .as('update.application')
      .middleware(middleware.can('admin-setup-application'))
  })
  .prefix('/account/admin/settings')
  .as('admin.settings')
  .middleware([middleware.auth()])
