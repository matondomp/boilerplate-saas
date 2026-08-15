import { routeAdapter } from '#app/adapters/route_adapter'
import { makeListUsersFactory } from '#modules/admin/settings/acl/users_management/framework/main/factories/make_list_users_factory'
import { makeCreateUserFactory } from '#modules/admin/settings/acl/users_management/framework/main/factories/make_create_user_factory'
import { makeDeleteUserControllerFactory } from './factories/make_delete_user_controller_factory.js'
import { makeRedefineUserPasswordControllerFactory } from './factories/make_redefine_user_password_controller_factory.js'
import { makeUnblockUserControllerFactory } from './factories/make_unblock_user_controller_factory.js'
import { makeBlockUserControllerFactory } from './factories/make_block_user_controller_factory.js'
import { makeViewUserControllerFactory } from './factories/make_view_user_controller_factory.js'
import { makeUpdateUserControllerFactory } from './factories/make_update_user_controller_factory.js'
import { makeImpersonateControllerFactory } from './factories/make_impersonate_user_controller_factory.js'
import { makeStopImpersonateControllerFactory } from './factories/make_stop_impersonate_user_controller_factory.js'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router
      .get(
        '/users',
        routeAdapter(makeListUsersFactory(), {
          operation: 'admin-acl-list-users',
          description: '[Admin->Settings->Users] List all users',
        })
      )
      .as('view.users')
      .middleware(middleware.can('admin-acl-view-users'))

    router
      .get(
        '/users/:username',
        routeAdapter(makeViewUserControllerFactory(), {
          operation: 'admin-acl-view-a-user-profile',
          description: '[Admin->Settings->Users] View a user profile',
        })
      )
      .as('view.user')
      .middleware(middleware.can('admin-acl-view-users'))

    router
      .post(
        '/users/impersonate',
        routeAdapter(makeImpersonateControllerFactory(), {
          operation: 'root-acl-impersonate-user',
          description: '[Admin] Impersonate User',
        })
      )
      .as('impersonate.user')
      .middleware(middleware.can('admin-acl-impersonate-user'))

    router
      .post(
        '/users/stop/impersonate',
        routeAdapter(makeStopImpersonateControllerFactory(), {
          operation: 'root-acl-stop-impersonate-user',
          description: '[Admin] Stop Impersonate User',
        })
      )
      .as('stop.impersonate.user')

    router
      .post(
        '/users',
        routeAdapter(
          makeCreateUserFactory(),
          {
            operation: 'admin-acl-create-user',
            description: '[Admin->Settings->Users] Create a user',
          },
          false
        )
      )
      .as('create.user')
      .middleware(middleware.can('admin-acl-create-user'))

    router
      .delete(
        '/users',
        routeAdapter(makeDeleteUserControllerFactory(), {
          operation: 'admin-acl-delete-user',
          description: '[Admin->Settings->Users] Delete a user',
        })
      )
      .as('remove.user')
      .middleware([middleware.can('admin-acl-delete-user')])

    router
      .put(
        '/users/block',
        routeAdapter(makeBlockUserControllerFactory(), {
          operation: 'admin-acl-block-user',
          description: '[Admin->Settings->Users] Inactive a user',
        })
      )
      .as('inactive.user')

      .middleware([middleware.can('admin-acl-inactive-user')])

    router
      .put(
        '/users/unblock',
        routeAdapter(makeUnblockUserControllerFactory(), {
          operation: 'admin-acl-unblock-user',
          description: '[Admin->Settings->Users] Reactive a user',
        })
      )
      .as('reactive.user')
      .middleware([middleware.can('admin-acl-active-user')])

    router
      .put(
        '/users/:username',
        routeAdapter(makeUpdateUserControllerFactory(), {
          operation: 'admin-acl-update-a-user',
          description: '[Admin->Settings->Users] Update a user',
        })
      )
      .as('update.user')

      .middleware(middleware.can('admin-acl-modify-user'))
  })
  .prefix('/account/admin/settings/acl')
  .middleware([middleware.auth()])
  .as('account.admin.settings.acl')

router
  .group(() => {
    router
      .put(
        '/users/redefine_password',
        routeAdapter(makeRedefineUserPasswordControllerFactory(), {
          operation: 'admin-acl-redefine-user',
          description: '[Admin->Settings->Users] Redefine password of a user',
        })
      )
      .as('redifine.user.password')
      .middleware([middleware.can('admin-acl-reset-user')])
  })
  .prefix('api/account/admin/settings/acl')
  .middleware([middleware.auth({ guards: ['apiWeb'] })])
  .as('api.account.admin.settings.acl')
