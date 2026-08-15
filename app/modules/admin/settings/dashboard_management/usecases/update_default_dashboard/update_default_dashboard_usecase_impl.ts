import { UpdateDefaultDashboardUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { UpdateDefaultDashboardUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { UpdateDefaultDashboardRepository } from './ports/index.js'
import { Either, left, right } from '#core/domain/index'
import { DashboardNotFoundError } from '../../domain/errors/dashboard_not_found_error.js'
import { FindDashboardBySlugRepository } from '../find_dashboard/ports/index.js'

export class UpdateDefaultDashboardUseCaseImpl implements UpdateDefaultDashboardUseCase {
  constructor(
    private readonly findDashboardBySlugRepository: FindDashboardBySlugRepository,
    private readonly UpdateDefaultDashboardRespository: UpdateDefaultDashboardRepository
  ) {}

  async perform(
    input: UpdateDefaultDashboardUseCaseInput
  ): Promise<Either<DashboardNotFoundError, void>> {
    const dashboard = await this.findDashboardBySlugRepository.find(input.dashboardSlug)

    if (!dashboard) {
      return left(new DashboardNotFoundError())
    }

    return right(await this.UpdateDefaultDashboardRespository.update(input))
  }
}
