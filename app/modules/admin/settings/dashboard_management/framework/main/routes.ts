import { routeAdapter } from '#app/adapters/route_adapter'
import { makeCreateDashboardFactory, makeListDashboardsFactory } from './factories/index.js'
import { makeListDashboardDetailsFactory } from './factories/make_list_dashboard_details_factory.js'
import { makeCreateDashboardItemFactory } from './factories/make_create_dashboard_item_factory.js'
import { makeUpdateDashboardItemsFactory } from './factories/make_update_dashboard_items_factory.js'
import { makeUpdateDashboardFactory } from './factories/make_update_dashboard_factory.js'
import { makeDeleteDashboardFactory } from './factories/make_delete_dashboard_factory.js'
import { makeDeleteDashboardItemFactory } from './factories/make_delete_dashboard_item_factory.js'
import { makeUpdateDashboardItemFactory } from './factories/make_update_dashboard_item_factory.js'
import { makeAttachDashboardItemFactory } from './factories/make_attach_dashboard_item_factory.js'
import { makeListDashboardItemsFactory } from './factories/make_list_dashboard_items_factory.js'
import { makeDetachDashboardItemFactory } from './factories/make_detach_dashboard_item_factory.js'
import { makeUpdateDefaultDashboardFactory } from './factories/make_update_default_dashboard_factory.js'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router
      .get('/', ({ response }) => {
        return response.redirect('/account/admin/settings/dashboards/manage')
      })
      .as('admin.settings.dashboards')

    router
      .get(
        '/manage',
        routeAdapter(makeListDashboardsFactory(), {
          operation: 'list-manage-dashboards',
          description: '[Admin->Settings->Dashboard-Management] List and manage dashboard',
        })
      )
      .as('admin.settings.dashboards.manage')
      .middleware([middleware.can('admin-view-dashboards')])

    router
      .get(
        '/:slug',
        routeAdapter(makeListDashboardDetailsFactory(), {
          operation: 'list-dashboard-details',
          description: '[Admin->Settings->Dashboard-Management] List dashboard details',
        })
      )
      .as('admin.settings.dashboards.details')
      .middleware([middleware.can('admin-view-dashboard-details')])
  })
  .prefix('/account/admin/settings/dashboards')
  .middleware([middleware.auth()])
  .as('admin.settings.dashboards')

router
  .group(() => {
    router
      .post(
        '/create',
        routeAdapter(makeCreateDashboardFactory(), {
          operation: 'create-dashboard',
          description: '[Admin->Settings->Dashboard-Management] Create Dashboard',
        })
      )
      .as('api.admin.settings.dashboards.create')
      .middleware([middleware.can('admin-create-dashboards')])

    router
      .post(
        '/item/create',
        routeAdapter(makeCreateDashboardItemFactory(), {
          operation: 'create-dashboard-item',
          description: '[Admin->Settings->Dashboard-Management] Create dashboard-item',
        })
      )
      .as('api.admin.settings.dashboards.item.create')

    router
      .post(
        '/:dashboardSlug/items/:itemId',
        routeAdapter(makeAttachDashboardItemFactory(), {
          operation: 'attach-item-to-dashboard',
          description: '[Admin->Settings->Dashboard-Management] Attach item to dashboard',
        })
      )
      .as('api.admin.settings.dashboards.item.attach')
      .middleware([middleware.can('admin-attach-dashboard-item')])

    router
      .get(
        '/items',
        routeAdapter(makeListDashboardItemsFactory(), {
          operation: 'list-dashboard-items',
          description: '[Admin->Settings->Dashboard-Management] List dashboard items',
        })
      )
      .as('api.admin.settings.dashboards.items')
      .middleware([middleware.can('admin-list-items')])

    router
      .put(
        '/items/:id',
        routeAdapter(makeUpdateDashboardItemFactory(), {
          operation: 'update-dashboard-item',
          description: '[Admin->Settings->Dashboard-Management] Update dashboard item',
        })
      )
      .as('api.admin.settings.dashboards.item.update')

    router
      .put(
        '/items',
        routeAdapter(makeUpdateDashboardItemsFactory(), {
          operation: 'update-items-coordinates',
          description: '[Admin->Settings->Dashboard-Management] Update items coordinates',
        })
      )
      .as('api.admin.settings.dashboards.items.update')
      .middleware([middleware.can('admin-edit-dashboard-items')])

    router
      .put(
        '/:slug',
        routeAdapter(makeUpdateDashboardFactory(), {
          operation: 'update-dashboard',
          description: '[Admin->Settings->Dashboard-Management] Update dashboard',
        })
      )
      .as('api.admin.settings.dashboards.update')
      .middleware([middleware.can('admin-edit-dashboard')])

    router
      .put(
        '/default/:dashboardSlug',
        routeAdapter(makeUpdateDefaultDashboardFactory(), {
          operation: 'update-default-dashboard',
          description: '[Admin->Settings->Dashboard-Management] Update default dashboard',
        })
      )
      .as('api.admin.settings.dashboards.default.update')
      .middleware([middleware.can('admin-set-default-dashboard')])

    router
      .delete(
        '/:slug',
        routeAdapter(makeDeleteDashboardFactory(), {
          operation: 'delete-dashboard',
          description: '[Admin->Settings->Dashboard-Management] Delete dashboard',
        })
      )
      .as('api.admin.settings.dashboards.delete')
      .middleware([middleware.can('admin-delete-dashboard')])

    router
      .delete(
        '/:dashboardSlug/items/:dashboardItemId',
        routeAdapter(makeDetachDashboardItemFactory(), {
          operation: 'detach-item-from-dashboard',
          description: '[Admin->Settings->Dashboard-Management] Detach item from dashboard',
        })
      )
      .as('api.admin.settings.dashboards.item.detach')
      .middleware([middleware.can('admin-detach-dashboard-item')])

    router
      .delete(
        '/items/:id',
        routeAdapter(makeDeleteDashboardItemFactory(), {
          operation: 'delete-dashboard-item',
          description: '[Admin->Settings->Dashboard-Management] Delete dashboard item',
        })
      )
      .as('api.admin.settings.dashboards.item.delete')
  })
  .prefix('/api/account/admin/settings/dashboards')
  .middleware([middleware.auth({ guards: ['apiWeb'] })])
  .as('api.admin.settings.dashboards')
