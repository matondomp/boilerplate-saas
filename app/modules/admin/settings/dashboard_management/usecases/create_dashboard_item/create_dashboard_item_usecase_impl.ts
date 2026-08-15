import {
  CreateDashboardItemUseCase,
  CreateDashboardItemUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { CreateDashboardItemRepository } from './ports/index.js'

export class CreateDashboardItemUseCaseImpl implements CreateDashboardItemUseCase {
  constructor(private readonly createDashboardItemRepository: CreateDashboardItemRepository) {}

  async perform(input: CreateDashboardItemUseCaseInput): Promise<void> {
    return await this.createDashboardItemRepository.create(input)
  }
}
