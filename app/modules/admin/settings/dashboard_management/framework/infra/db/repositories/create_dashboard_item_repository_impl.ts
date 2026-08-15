import { CreateDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { CreateDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/index'
import { DashboardItemModel } from '../models/index.js'

export class CreateDashboardItemRepositoryImpl implements CreateDashboardItemRepository {
  async create(input: CreateDashboardItemUseCaseInput): Promise<void> {
    await DashboardItemModel.create(input)
  }
}
