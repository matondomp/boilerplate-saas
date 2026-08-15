import {
  UpdateDashboardItemsUseCase,
  UpdateDashboardItemsUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/update_dashboard_items/index'
import { UpdateDashboardItemsRepository } from './ports/index.js'

export class UpdateDashboardItemsUseCaseImpl implements UpdateDashboardItemsUseCase {
  constructor(private readonly updateDashboardItemsRespository: UpdateDashboardItemsRepository) {}

  async perform(input: UpdateDashboardItemsUseCaseInput): Promise<void> {
    return await this.updateDashboardItemsRespository.update(input)
  }
}
