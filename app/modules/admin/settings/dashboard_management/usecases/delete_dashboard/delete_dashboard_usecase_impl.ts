import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard/index'
import { Either, left, right } from '#core/domain/index'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'
import { CannotDeleteDefaultDashboardError } from '#modules/admin/settings/dashboard_management/domain/errors/cannot_delete_default_dashboard_error'
import { DeleteDashboardUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/delete_dashboard/delete_dashboard_usecase'
import { UpdateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/update_dashboard/index'

export class DeleteDashboardUseCaseImpl implements DeleteDashboardUseCase {
  constructor(
    private readonly findDashboardBySlugRepository: FindDashboardBySlugRepository,
    private readonly updateDashboardRepository: UpdateDashboardRepository
  ) {}

  async perform(input: string): Promise<Either<DashboardNotFoundError, void>> {
    const dashboardEntity = await this.findDashboardBySlugRepository.find(input)

    if (!dashboardEntity) {
      return left(new DashboardNotFoundError())
    }

    if (dashboardEntity.isDefault) {
      return left(new CannotDeleteDefaultDashboardError())
    }

    dashboardEntity.delete()

    return right(await this.updateDashboardRepository.update(dashboardEntity))
  }
}
