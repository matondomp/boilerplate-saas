import { UpdateDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardItemModel } from '../models/index.js'
import { UpdateDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'

export class UpdateDashboardItemRepositoryImpl implements UpdateDashboardItemRepository {
  async update(input: UpdateDashboardItemUseCaseInput): Promise<void> {
    const dashboardItem = await DashboardItemModel.findBy('id', input.id)
    dashboardItem!
      .merge({
        name: input.name,
      })
      .save()
  }
}
