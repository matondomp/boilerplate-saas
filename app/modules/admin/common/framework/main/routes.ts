import router from '@adonisjs/core/services/router'
import { routeAdapter } from '#app/adapters/route_adapter'
import { middleware } from '#start/kernel'

import { makeShowSettingsPageControllerFactory } from './factories/make_show_settings_page_controller_factory.js'
import { makeUpdateUserNotificationsController } from './factories/make_update_user_notifications_controller.js'
import { makeUpdatePasswordControllerFactory } from './factories/make_update_password_controller_factory.js'
import { makeUpdateUserInfoControllerFactory } from './factories/make_update_user_info_controller_factory.js'
import { makeViewDashboardsPageControllerFactory } from './factories/make_view_dashboards_page_controller_factory.js'
import { makeRetrieveNewestNotificationsControllerFactory } from './factories/make_retrieve_newest_notifications_controller_factory.js'
import { makeRetrieveUserActivitiesControllerFactory } from './factories/make_retrieve_user_activities_controller_factory.js'
import { makeRetrieveDashboardDetailsControllerFactory } from './factories/make_retrieve_dashboard_details_items_factory.js'

router
  .group(() => {
    router
      .get('/', ({ response }) => {
        return response.redirect('/account/dashboard')
      })
      .as('index')

    router
      .get(
        '/dashboard',
        routeAdapter(makeViewDashboardsPageControllerFactory(), {
          operation: 'view-dashboard-page',
          description: '[Admin->Common] View dashboard page',
        })
      )
      .as('dashboard')

    router
      .get(
        '/profile',
        routeAdapter(
          {
            perform: async ({ inertia }) => {
              return inertia.render<any>('common_profile/common_profile_page')
            },
          },
          {
            operation: 'view-my-user-profile-page',
            description: '[Admin->Common] View my user profile page',
          }
        )
      )
      .as('profile')

    router
      .get(
        '/settings',
        routeAdapter(makeShowSettingsPageControllerFactory(), {
          operation: 'account-view-settings-page',
          description: '[Admin->Common] View Account Setting Page',
        })
      )
      .as('settings')

    router
      .put(
        '/settings/password',
        routeAdapter(makeUpdatePasswordControllerFactory(), {
          operation: 'update-my-password',
          description: '[Admin->Common] Update my password',
        })
      )
      .as('settings.password')

    router
      .put(
        '/settings/users/info',
        routeAdapter(makeUpdateUserInfoControllerFactory(), {
          operation: 'update-user-info',
          description: '[Admin->Common] Update user info',
        })
      )
      .as('settings.user.info')

    router
      .put(
        '/notifications',
        routeAdapter(makeUpdateUserNotificationsController(), {
          operation: 'update-user-notifications',
          description: '[Admin->Common] Update User Notifications',
        })
      )
      .as('notifications')
  })
  .prefix('account')
  .middleware([middleware.auth()])
  .as('admin.common')

router
  .group(() => {
    router
      .get(
        '/me/notifications',
        routeAdapter(makeRetrieveNewestNotificationsControllerFactory(), {
          operation: 'retrieve-user-latest-unread-notifications',
          description: '[Api->Admin->Common] Retrieve the newest unread user notifications',
        })
      )
      .as('notifications.me')

    router
      .get(
        '/:userId/activities',
        routeAdapter(makeRetrieveUserActivitiesControllerFactory(), {
          operation: 'retrieve-top-recent-user-activities',
          description: '[Api->Admin->Common] Retrieve most recent user activity',
        })
      )
      .as('activities')

    router
      .get(
        '/dashboard/:dashboardSlug',
        routeAdapter(makeRetrieveDashboardDetailsControllerFactory(), {
          operation: 'list-dashboard-items',
          description: '[Admin->Common] List dashboard items',
        })
      )
      .as('dashboard')
  })
  .prefix('api/account')
  .middleware([middleware.auth()])
  .as('api.admin.common')
