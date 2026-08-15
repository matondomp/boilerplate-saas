import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard/ports/index'
import { UniqueEntityID } from '#core/domain/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export const makeFindDashboardBySlugRepositoryStub = (): FindDashboardBySlugRepository => {
  return new (class implements FindDashboardBySlugRepository {
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
