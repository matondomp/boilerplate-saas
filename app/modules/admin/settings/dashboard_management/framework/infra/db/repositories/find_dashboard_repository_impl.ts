import { DashboardMapper } from '#modules/admin/settings/dashboard_management/framework/infra/db/mappers/index'
import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard/ports/find_dashboard_repository'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export class FindDashboardBySlugRepositoryImpl implements FindDashboardBySlugRepository {
  constructor(private readonly dashboardMapper: DashboardMapper = new DashboardMapper()) {}

  async find(input: string): Promise<DashboardEntity | undefined> {
    const dashboard = await DashboardModel.query().where('slug', input).first()
    if (!dashboard) {
      return
    }
    return this.dashboardMapper.toDomain(dashboard)
  }
}
