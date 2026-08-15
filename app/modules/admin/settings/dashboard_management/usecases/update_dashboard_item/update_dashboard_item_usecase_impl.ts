import {
  UpdateDashboardItemUseCase,
  UpdateDashboardItemUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/update_dashboard_item/index'
import { FindDashboardItemByIdRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDashboardItemRepository } from './ports/index.js'
import { Either, left, right } from '#core/domain/index'
import { DashboardItemNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_item_not_found_error'

export class UpdateDashboardItemUseCaseImpl implements UpdateDashboardItemUseCase {
  constructor(
    private readonly updateDashboardItemRespository: UpdateDashboardItemRepository,
    private readonly findDashboardItemByIdRepository: FindDashboardItemByIdRepository
  ) {}

  async perform(
    input: UpdateDashboardItemUseCaseInput
  ): Promise<Either<DashboardItemNotFoundError, void>> {
    const dashboardItem = await this.findDashboardItemByIdRepository.find(input.id)

    if (!dashboardItem) {
      return left(new DashboardItemNotFoundError())
    }

    return right(await this.updateDashboardItemRespository.update(input))
  }
}
