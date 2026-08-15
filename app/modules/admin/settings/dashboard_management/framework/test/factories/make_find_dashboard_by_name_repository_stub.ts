import { UniqueEntityID } from '#core/domain/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { FindDashboardByNameRepository } from '#modules/admin/settings/dashboard_management/usecases/index'

export const makeFindDashboardByNameRepositoryStub = (): FindDashboardByNameRepository => {
  return new (class implements FindDashboardByNameRepository {
    async find(_name: string): Promise<DashboardEntity | undefined> {
      const dashboardEntity = DashboardEntity.hydrate(new UniqueEntityID('valid_id'), {
        name: 'valid_name',
        description: 'valid_description',
        slug: 'valid_slug',
        isDefault: false,
      })

      return dashboardEntity
    }
  })()
}
