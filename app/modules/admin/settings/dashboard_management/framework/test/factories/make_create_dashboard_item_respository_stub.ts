import { CreateDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { CreateDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/index'

export const makeCreateDashboardItemRepositoryStub = (): CreateDashboardItemRepository => {
  return new (class implements CreateDashboardItemRepository {
    async create(_input: CreateDashboardItemUseCaseInput): Promise<void> {
      return
    }
  })()
}
