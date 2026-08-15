import { FindDashboardBySlugRepository } from './ports/index.js'
import { FindDashboardBySlugUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/find_dashboard/find_dashboard_usecase'
import { FindDashboardBySlugUseCaseOutput } from '#modules/admin/settings/dashboard_management/domain/usecases/find_dashboard/find_dashboard_usecase_output'

export class FindDashboardBySlugUseCaseImpl implements FindDashboardBySlugUseCase {
  constructor(private readonly findDashboardBySlugRepository: FindDashboardBySlugRepository) {}

  async perform(input: string): Promise<FindDashboardBySlugUseCaseOutput | undefined> {
    return await this.findDashboardBySlugRepository.find(input)
  }
}
