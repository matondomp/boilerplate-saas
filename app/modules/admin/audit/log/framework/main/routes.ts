import router from '@adonisjs/core/services/router'
import { routeAdapter } from '#app/adapters/route_adapter'
import { makeViewLogsWebFactory } from './factories/view_logs_web_factory.js'
import { makeExtractLogsFactory } from './factories/extract_logs_factory.js'
import { middleware } from '#start/kernel'
import { makeViewLogsRestFactory } from './factories/view_logs_rest_factory.js'

router
  .group(() => {
    router
      .get(
        '/logs',
        routeAdapter(makeViewLogsWebFactory(), {
          operation: 'view-logs',
          description: '[Admin->Audit] View application logs',
        })
      )
      .middleware(middleware.can('admin-view-logs'))
  })
  .middleware([middleware.auth()])
  .prefix('/account/admin/audit')

router
  .group(() => {
    router.get(
      '/logs/extract',
      routeAdapter(makeExtractLogsFactory(), {
        operation: 'extract-logs',
        description: '[Admin->Audit->Log] Extract logs',
      })
    )
    router.get(
      '/logs',
      routeAdapter(makeViewLogsRestFactory(), {
        operation: 'filter-logs',
        description: '[Admin->Audit->Log] Filter logs',
      })
    )
  })
  .middleware([middleware.auth()])
  .prefix('api/account/admin/audit')
