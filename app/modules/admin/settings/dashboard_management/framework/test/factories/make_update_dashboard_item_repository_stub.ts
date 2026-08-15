import { UpdateDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/index'

export const makeUpdateDashboardItemRepositoryStub = (): UpdateDashboardItemRepository => {
  return new (class implements UpdateDashboardItemRepository {
    async update(_input: UpdateDashboardItemUseCaseInput): Promise<void> {
      return
    }
  })()
}
