import {
  UpdateDashboardUseCase,
  UpdateDashboardUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { UpdateDashboardRepository } from './ports/index.js'
import { Either, left, right } from '#core/domain/index'
import { FindDashboardBySlugRepository } from '../find_dashboard/ports/index.js'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'

export class UpdateDashboardUseCaseImpl implements UpdateDashboardUseCase {
  constructor(
    private readonly findDashboardBySlugRepository: FindDashboardBySlugRepository,
    private readonly updateDashboardRespository: UpdateDashboardRepository
  ) {}

  async perform(input: UpdateDashboardUseCaseInput): Promise<Either<DashboardNotFoundError, void>> {
    const dashboard = await this.findDashboardBySlugRepository.find(input.slug)

    if (!dashboard) {
      return left(new DashboardNotFoundError())
    }

    dashboard.changeDescription(input.description)
    dashboard.changeName(input.name)

    return right(await this.updateDashboardRespository.update(dashboard))
  }
}
