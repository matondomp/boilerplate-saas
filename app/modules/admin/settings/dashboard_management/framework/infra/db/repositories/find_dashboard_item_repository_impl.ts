import { FindDashboardItemByIdRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { FindDashboardItemByIdUseCaseOutput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { DashboardItemModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'

export class FindDashboardItemByIdRepositoryImpl implements FindDashboardItemByIdRepository {
  async find(input: string): Promise<FindDashboardItemByIdUseCaseOutput | undefined> {
    const dashboardItem = await DashboardItemModel.find(input)
    if (!dashboardItem) {
      return
    }
    return dashboardItem
  }
}
