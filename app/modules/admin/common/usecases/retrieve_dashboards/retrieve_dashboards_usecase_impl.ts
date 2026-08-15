import { RetrieveDashboardsUseCase } from '#modules/admin/common/domain/usecases/retrieve_dashboards/retrieve_dashboards_usecase'
import { RetrieveDashboardsUseCaseOutput } from '#modules/admin/common/domain/usecases/retrieve_dashboards/retrieve_dashboards_usecase_output'
import { RetrieveDashboardsRepository } from './ports/index.js'

export class RetrieveDashboardsUseCaseImpl implements RetrieveDashboardsUseCase {
  constructor(private readonly retrieveDashboardsRepository: RetrieveDashboardsRepository) {}
  async perform(): Promise<RetrieveDashboardsUseCaseOutput> {
    return this.retrieveDashboardsRepository.findAll().then((dashboards) =>
      dashboards.map((dashboard) => ({
        slug: dashboard.slug,
        name: dashboard.name,
        isDefault: dashboard.isDefault,
      }))
    )
  }
}
