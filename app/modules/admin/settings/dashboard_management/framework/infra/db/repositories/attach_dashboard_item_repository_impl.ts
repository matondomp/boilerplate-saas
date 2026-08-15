import { AttachDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { AttachDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/attach_dashboard_item/index'
import { DashboardModel } from '../models/index.js'

export class AttachDashboardItemRepositoryImpl implements AttachDashboardItemRepository {
  async attach(input: AttachDashboardItemUseCaseInput): Promise<void> {
    const dashboard = await DashboardModel.findBy('slug', input.dashboardSlug)
    await dashboard!.related('items').attach({
      [input.dashboardItemId]: {
        width: input.width,
        height: input.height,
        x: input.x,
        y: input.y,
      },
    })
  }
}
