import { DetachDashboardItemUseCaseInput } from './../../domain/usecases/detach_dashboard_item/index.js'
import { DetachDashboardItemUseCase } from '../../domain/usecases/detach_dashboard_item/index.js'
import { DetachDashboardItemRepository } from './ports/detach_dashboard_item_repository.js'
import { FindDashboardItemByIdRepository } from './../find_dashboard_item/ports/find_dashboard_item_repository.js'
import { Either, left, right } from '#core/domain/index'
import { DashboardItemNotFoundError } from '../../domain/errors/dashboard_item_not_found_error.js'
import { FindDashboardBySlugRepository } from '../find_dashboard/ports/index.js'
import { DashboardNotFoundError } from '../../domain/errors/dashboard_not_found_error.js'

export class DetachDashboardItemUseCaseImpl implements DetachDashboardItemUseCase {
  constructor(
    private readonly findDashboardBySlugRepository: FindDashboardBySlugRepository,
    private readonly findDashboardItemByIdRepository: FindDashboardItemByIdRepository,
    private readonly detachDashboardItemRepository: DetachDashboardItemRepository
  ) {}

  async perform(
    input: DetachDashboardItemUseCaseInput
  ): Promise<Either<DashboardNotFoundError | DashboardItemNotFoundError, void>> {
    const dashboard = await this.findDashboardBySlugRepository.find(input.dashboardSlug)
    const dashboardItem = await this.findDashboardItemByIdRepository.find(input.dashboardItemId)

    if (!dashboard) {
      return left(new DashboardNotFoundError())
    }

    if (!dashboardItem) {
      return left(new DashboardItemNotFoundError())
    }

    return right(await this.detachDashboardItemRepository.detach(input))
  }
}
