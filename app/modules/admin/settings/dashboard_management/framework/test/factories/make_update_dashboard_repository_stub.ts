import { UpdateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export const makeUpdateDashboardRepositoryStub = (): UpdateDashboardRepository => {
  return new (class implements UpdateDashboardRepository {
    async update(_input: DashboardEntity): Promise<void> {
      return
    }
  })()
}
