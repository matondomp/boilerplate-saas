import { UniqueEntityID } from '#core/domain/index'
import { DashboardItemEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { Chart } from '#modules/admin/settings/dashboard_management/domain/types/chart_types'
import { ListDashboardItemsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'

export const makeListDashboardItemsRepositoryStub = (): ListDashboardItemsRepository => {
  return new (class implements ListDashboardItemsRepository {
    async list(): Promise<DashboardItemEntity[]> {
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

      return [dashboardItemEntity]
    }
  })()
}
