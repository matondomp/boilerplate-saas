import { ListDashboardsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UniqueEntityID } from '#core/domain/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export const makeListDashboardsRepositoryStub = (): ListDashboardsRepository => {
  return new (class implements ListDashboardsRepository {
    async list(): Promise<DashboardEntity[]> {
      const dashboardEntity = DashboardEntity.hydrate(new UniqueEntityID('valid_id'), {
        name: 'valid_name',
        description: 'valid_description',
        slug: 'valid_slug',
        isDefault: false,
      })

      return [dashboardEntity]
    }
  })()
}
