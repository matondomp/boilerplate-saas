import { DetachDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/index'
import { DetachDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/index'

export const makeDetachDashboardItemByIdRepositoryStub = (): DetachDashboardItemRepository => {
  return new (class implements DetachDashboardItemRepository {
    async detach(_input: DetachDashboardItemUseCaseInput): Promise<void> {
      return
    }
  })()
}
