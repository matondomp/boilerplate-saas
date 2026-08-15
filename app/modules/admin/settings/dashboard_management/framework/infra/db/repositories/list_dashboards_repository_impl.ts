import { ListDashboardsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { ListDashboardsUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/index'
import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'
import { DashboardMapper } from '#modules/admin/settings/dashboard_management/framework/infra/db/mappers/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export class ListDashboardsRepositoryImpl implements ListDashboardsRepository {
  constructor(private readonly dashboardMapper: DashboardMapper = new DashboardMapper()) {}

  async list(_: ListDashboardsUseCaseInput): Promise<DashboardEntity[]> {
    const dashboards = await DashboardModel.query()
      .whereNull('deleted_at')
      .orderBy([
        {
          column: 'is_default',
          order: 'desc',
        },
        {
          column: 'created_at',
          order: 'desc',
        },
      ])

    return dashboards.map((dashboard) => this.dashboardMapper.toDomain(dashboard))
  }
}
