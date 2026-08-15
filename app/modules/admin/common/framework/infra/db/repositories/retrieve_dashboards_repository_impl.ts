import { RetrieveDashboardsRepository } from '#modules/admin/common/usecases/retrieve_dashboards/index'
import { RetrieveDashboardsUseCaseOutput } from '#modules/admin/common/domain/usecases/retrieve_dashboards/retrieve_dashboards_usecase_output'
import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'

export class RetrieveDashboardsRepositoryImpl implements RetrieveDashboardsRepository {
  async findAll(): Promise<RetrieveDashboardsUseCaseOutput> {
    return await DashboardModel.query().whereNull('deleted_at')
  }
}
