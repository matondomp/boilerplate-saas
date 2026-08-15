import { UpdateDefaultDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDefaultDashboardUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/index'

export const makeUpdateDefaultDashboardRepositoryStub = (): UpdateDefaultDashboardRepository => {
  return new (class implements UpdateDefaultDashboardRepository {
    async update(_input: UpdateDefaultDashboardUseCaseInput): Promise<void> {
      return
    }
  })()
}
