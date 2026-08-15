import Factory from '@adonisjs/lucid/factories'
import { DashboardItemModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'
import { Chart } from '#modules/admin/settings/dashboard_management/domain/types/chart_types'

export const dashboardItemFactory = Factory.define(DashboardItemModel, ({ faker }) => {
  const slug = faker.lorem.slug()
  return {
    name: slug,
    slug,
    chartType: Chart.BAR,
    sqlRaw: 'SELECT * from core_dashboard_items',
  }
}).build()
