import { DetachDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { DetachDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/detach_dashboard_item/index'
import { DashboardModel } from '../models/index.js'

export class DetachDashboardItemRepositoryImpl implements DetachDashboardItemRepository {
  async detach(input: DetachDashboardItemUseCaseInput): Promise<void> {
    const dashboard = await DashboardModel.findBy('slug', input.dashboardSlug)
    await dashboard!.related('items').detach([input.dashboardItemId])
  }
}
