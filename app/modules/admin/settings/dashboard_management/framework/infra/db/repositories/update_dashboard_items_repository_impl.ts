import { UpdateDashboardItemsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDashboardItemsUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { DashboardDashboardItemModel } from '../models/dashboard_dashboard_item_model.js'

export class UpdateDashboardItemsRepositoryImpl implements UpdateDashboardItemsRepository {
  async update(input: UpdateDashboardItemsUseCaseInput): Promise<void> {
    // await DashboardItemModel.updateOrCreateMany('id', input)
    await DashboardDashboardItemModel.updateOrCreateMany(['dashboardSlug', 'itemId'], input)
  }
}
