import { UniqueEntityID } from '#core/domain/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { CreateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import {
  CreateDashboardUseCaseInput,
  CreateDashboardUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/index'

export const makeCreateDashboardRepositoryStub = (): CreateDashboardRepository => {
  return new (class implements CreateDashboardRepository {
    async create(input: CreateDashboardUseCaseInput): Promise<CreateDashboardUseCaseOutput> {
      const dashboardEntity = DashboardEntity.hydrate(new UniqueEntityID('valid_id'), {
        name: input.name,
        description: input.description,
        slug: 'valid_slug',
        isDefault: false,
      })

      return dashboardEntity
    }
  })()
}
