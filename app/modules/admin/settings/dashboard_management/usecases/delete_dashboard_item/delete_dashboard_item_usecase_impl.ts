import { DeleteDashboardItemUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { DeleteDashboardItemRepository } from './ports/delete_dashboard_item_repository.js'
import { FindDashboardItemByIdRepository } from '../find_dashboard_item/ports/index.js'
import { Either, left, right } from '#core/domain/index'
import { DashboardItemNotFoundError } from '../../domain/errors/dashboard_item_not_found_error.js'

export class DeleteDashboardItemUseCaseImpl implements DeleteDashboardItemUseCase {
  constructor(
    private readonly findDashboardItemByIdRepository: FindDashboardItemByIdRepository,
    private readonly deleteDashboardItemRepository: DeleteDashboardItemRepository
  ) {}

  async perform(input: string): Promise<Either<DashboardItemNotFoundError, void>> {
    const dashboardItem = await this.findDashboardItemByIdRepository.find(input)

    if (!dashboardItem) {
      return left(new DashboardItemNotFoundError())
    }

    return right(await this.deleteDashboardItemRepository.delete(input))
  }
}
