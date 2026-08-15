import { UpdateDefaultDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardModel } from '../models/index.js'
import { UpdateDefaultDashboardUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'

export class UpdateDefaultDashboardRepositoryImpl implements UpdateDefaultDashboardRepository {
  async update(input: UpdateDefaultDashboardUseCaseInput): Promise<void> {
    await DashboardModel.query().where('isDefault', true).update('isDefault', false)
    const dashboard = await DashboardModel.findBy('slug', input.dashboardSlug)
    dashboard!
      .merge({
        isDefault: true,
      })
      .save()
  }
}
