import { routeAdapter } from '#app/adapters/route_adapter'
import router from '@adonisjs/core/services/router'

import {
  makeListRolesFactory,
  makeListDropdownRolesFactory,
  makeShowCreateRolePageControllerFactory,
  makeDeleteRoleFactory,
  makeCreateRoleControllerFactory,
  makeShowEditRolePageControllerFactory,
  makeUpdateRoleControllerFactory,
  makeDeleteBulkControllerFactory,
} from './factories/index.js'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router
      .get(
        '/',
        routeAdapter(makeListRolesFactory(), {
          operation: 'admin-acl-list-roles',
          description: '[Admin->Settings->Roles] List all roles',
        })
      )
      .as('list')
      .middleware(middleware.can('admin-acl-view-roles'))

    router
      .get(
        '/new',
        routeAdapter(makeShowCreateRolePageControllerFactory(), {
          operation: 'admin-acl-view-create-role-page',
          description: '[Admin->Settings->Roles] View create role page',
        })
      )
      .as('create_page')
      .middleware(middleware.can('admin-acl-create-role'))

    router
      .post(
        '/create',
        routeAdapter(makeCreateRoleControllerFactory(), {
          operation: 'admin-acl-create-role',
          description: '[Admin->Settings->Roles] Create a new role',
        })
      )
      .as('create')
      .middleware(middleware.can('admin-acl-create-role'))

    router
      .delete(
        '/delete',
        routeAdapter(makeDeleteRoleFactory(), {
          operation: 'admin-acl-delete-route',
          description: '[Admin->Settings->Roles] Delete a role',
        })
      )
      .as('delete')
      .middleware(middleware.can('admin-acl-delete-role'))

    router
      .delete(
        '/delete/bulk',
        routeAdapter(makeDeleteBulkControllerFactory(), {
          operation: 'admin-acl-delete-bulk-routes',
          description: '[Admin->Settings->Roles] Delete bulk roles',
        })
      )
      .as('delete.bulk')
      .middleware(middleware.can('admin-acl-delete-role'))

    router
      .get(
        '/:roleSlug/edit',
        routeAdapter(makeShowEditRolePageControllerFactory(), {
          operation: 'admin-acl-view-edit-role-page',
          description: '[Admin->Settings->Roles] View edit role page',
        })
      )
      .as('edit_page')
      .middleware(middleware.can('admin-acl-modify-role'))

    router
      .put(
        '/edit',
        routeAdapter(makeUpdateRoleControllerFactory(), {
          operation: 'admin-acl-edit-role-page',
          description: '[Admin->Settings->Roles] Edit role page',
        })
      )
      .as('edit')
      .middleware(middleware.can('admin-acl-modify-role'))
  })
  .prefix('/account/admin/settings/acl/roles')
  .middleware([middleware.auth()])
  .as('account.admin.settings.acl.roles')

router
  .group(() => {
    router
      .get(
        '/dropdown',
        routeAdapter(makeListDropdownRolesFactory(), {
          operation: 'admin-acl-list-dropdown-roles',
          description: '[Admin->Settings->Roles] List all roles as options',
        })
      )
      .as('roles.dropdown')
      .middleware(middleware.can('admin-acl-view-roles'))
  })
  .prefix('/api/admin/settings/acl/roles')
  .middleware([middleware.auth({ guards: ['apiWeb'] })])
