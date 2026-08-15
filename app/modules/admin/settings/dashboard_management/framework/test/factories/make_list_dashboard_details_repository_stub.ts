import { UniqueEntityID } from '#core/domain/index'
import { ListDashboardDetailsInput } from '#modules/admin/settings/dashboard_management/domain/index'
import { DashboardDashboarItemsAggregate } from '#modules/admin/settings/dashboard_management/domain/aggregates/index'
import {
  DashboardEntity,
  DashboardItemEntity,
} from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { Chart } from '#modules/admin/settings/dashboard_management/domain/types/chart_types'
import { ListDashboardDetailsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'

export const makeListDashboardDetailsRepositoryStub = (): ListDashboardDetailsRepository => {
  return new (class implements ListDashboardDetailsRepository {
    async find(_input: ListDashboardDetailsInput): Promise<DashboardDashboarItemsAggregate> {
      const dashboardItemEntity = DashboardItemEntity.hydrate(new UniqueEntityID('valid_id'), {
        chartType: Chart.BAR,
        slug: 'valid_slug',
        name: 'valid_name',
        sqlRaw: 'valid_sql_raw',
        x: 30,
        y: 40,
        width: 50,
        height: 50,
      })

      const dashboardEntity = DashboardEntity.hydrate(new UniqueEntityID('valid_id'), {
        name: 'valid_name',
        description: 'valid_description',
        slug: 'valid_slug',
        isDefault: false,
      })

      return DashboardDashboarItemsAggregate.hydrate({
        dashboard: dashboardEntity,
        dashboardItems: [dashboardItemEntity],
      })
    }
  })()
}
