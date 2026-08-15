import { DashboardMapper } from '#modules/admin/settings/dashboard_management/framework/infra/db/mappers/index'
import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'
import { FindDashboardByNameRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export class FindDashboardByNameRepositoryImpl implements FindDashboardByNameRepository {
  constructor(private readonly dashboardMapper: DashboardMapper = new DashboardMapper()) {}

  async find(input: string): Promise<DashboardEntity | undefined> {
    const dashboard = await DashboardModel.query().where('name', input).first()
    if (!dashboard) {
      return
    }
    return this.dashboardMapper.toDomain(dashboard)
  }
}
