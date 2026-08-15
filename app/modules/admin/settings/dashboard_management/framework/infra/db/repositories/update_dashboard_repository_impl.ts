import { DashboardMapper } from '#modules/admin/settings/dashboard_management/framework/infra/db/mappers/index'
import { UpdateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export class UpdateDashboardRepositoryImpl implements UpdateDashboardRepository {
  constructor(private readonly dashboardMapper: DashboardMapper = new DashboardMapper()) {}

  async update(dashboard: DashboardEntity): Promise<void> {
    const dashboardModel = await this.dashboardMapper.toPersistence(dashboard)
    await dashboardModel.save()
  }
}
