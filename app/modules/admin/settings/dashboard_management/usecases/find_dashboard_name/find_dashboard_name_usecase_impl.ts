import { FindDashboardByNameRepository } from './ports/index.js'
import { FindDashboardByNameUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export class FindDashboardByNameUseCaseImpl implements FindDashboardByNameUseCase {
  constructor(private readonly findDashboardByNameRepository: FindDashboardByNameRepository) {}

  async perform(input: string): Promise<DashboardEntity | undefined> {
    return await this.findDashboardByNameRepository.find(input)
  }
}
