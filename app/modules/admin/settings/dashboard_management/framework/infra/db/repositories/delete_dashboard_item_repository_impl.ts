import { DeleteDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardItemModel } from '../models/index.js'

export class DeleteDashboardItemRepositoryImpl implements DeleteDashboardItemRepository {
  async delete(input: string): Promise<void> {
    await DashboardItemModel.findBy('id', input).then((dashboardItem) => {
      dashboardItem!.delete()
    })
  }
}
