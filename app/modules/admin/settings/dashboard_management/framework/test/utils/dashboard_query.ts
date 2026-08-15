import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'

export async function queryDashboardWithItems(dashboardSlug: string) {
  return await DashboardModel.query()
    .where('slug', dashboardSlug)
    .preload('items', (item) => {
      item.pivotColumns(['width', 'height', 'x', 'y'])
    })
    .first()
}
