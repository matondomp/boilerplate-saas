import { FindDashboardItemByIdUseCaseOutput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { FindDashboardItemByIdUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { FindDashboardItemByIdRepository } from './ports/index.js'

export class FindDashboardItemByIdUseCaseImpl implements FindDashboardItemByIdUseCase {
  constructor(private readonly findDashboardItemByIdRespository: FindDashboardItemByIdRepository) {}

  async perform(input: string): Promise<FindDashboardItemByIdUseCaseOutput | undefined> {
    return await this.findDashboardItemByIdRespository.find(input)
  }
}
