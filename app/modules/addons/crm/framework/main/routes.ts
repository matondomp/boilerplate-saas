
import { routeAdapter } from '#app/adapters/route_adapter'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
        .get('/client-manage/client', routeAdapter(
            {
              perform: async ({ inertia }) => {
                return inertia.render<any>('client_manage/client')
              },
            },
            {
              operation: 'view-my-user-profile-page',
              description: '[Admin->Common] View my user profile page',
            }
          )
        )
    }).middleware([middleware.auth()])

