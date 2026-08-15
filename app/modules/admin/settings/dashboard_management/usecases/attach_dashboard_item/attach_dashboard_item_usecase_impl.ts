import { AttachDashboardItemUseCaseInput } from './../../domain/usecases/attach_dashboard_item/index.js'
import { AttachDashboardItemUseCase } from '../../domain/usecases/attach_dashboard_item/index.js'
import { AttachDashboardItemRepository } from './ports/attach_dashboard_item_repository.js'
import { FindDashboardItemByIdRepository } from './../find_dashboard_item/ports/find_dashboard_item_repository.js'
import { FindDashboardBySlugRepository } from './../find_dashboard/ports/find_dashboard_repository.js'
import { Either, left, right } from '#core/domain/index'
import { DashboardItemNotFoundError } from '../../domain/errors/dashboard_item_not_found_error.js'
import { DashboardNotFoundError } from '../../domain/errors/dashboard_not_found_error.js'

export class AttachDashboardItemUseCaseImpl implements AttachDashboardItemUseCase {
  constructor(
    private readonly findDashboardBySlugRepository: FindDashboardBySlugRepository,
    private readonly findDashboardItemByIdRepository: FindDashboardItemByIdRepository,
    private readonly attachDashboardItemRepository: AttachDashboardItemRepository
  ) {}

  async perform(
    input: AttachDashboardItemUseCaseInput
  ): Promise<Either<DashboardNotFoundError | DashboardItemNotFoundError, void>> {
    const dashboard = await this.findDashboardBySlugRepository.find(input.dashboardSlug)
    const dashboardItem = await this.findDashboardItemByIdRepository.find(input.dashboardItemId)

    if (!dashboardItem) {
      return left(new DashboardItemNotFoundError())
    }

    if (!dashboard) {
      return left(new DashboardNotFoundError())
    }

    return right(await this.attachDashboardItemRepository.attach(input))
  }
}
