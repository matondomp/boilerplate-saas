import {
  CreateDashboardUseCase,
  CreateDashboardUseCaseInput,
  CreateDashboardUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/index'
import { FindDashboardByNameRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { CreateDashboardRepository } from './ports/index.js'
import { Either, left, right } from '#core/domain/index'
import { DashboardAlreadyExistError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_already_exist_error'
import { UpdateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/update_dashboard/ports/update_dashboard_repository'

export class CreateDashboardeUseCaseImpl implements CreateDashboardUseCase {
  constructor(
    private readonly createDashboardRepository: CreateDashboardRepository,
    private readonly findDashboardByNameRepository: FindDashboardByNameRepository,
    private readonly updateDashboardRepository: UpdateDashboardRepository
  ) {}

  async perform(
    input: CreateDashboardUseCaseInput
  ): Promise<Either<DashboardAlreadyExistError, CreateDashboardUseCaseOutput>> {
    const dashboardEntity = await this.findDashboardByNameRepository.find(input.name)

    if (dashboardEntity && !dashboardEntity.isDeleted) {
      return left(new DashboardAlreadyExistError())
    }

    if (dashboardEntity && dashboardEntity.isDeleted) {
      dashboardEntity.changeDescription(input.description)
      dashboardEntity.restore()
      await this.updateDashboardRepository.update(dashboardEntity)
      return right(dashboardEntity)
    }

    return right(await this.createDashboardRepository.create(input))
  }
}
