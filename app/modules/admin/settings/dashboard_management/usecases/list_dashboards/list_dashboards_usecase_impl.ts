import {
  ListDashboardsUseCase,
  ListDashboardsUseCaseInput,
  ListDashboardsUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/index'
import { ListDashboardsRepository } from './ports/index.js'
import { DateAdapter } from '#shared/domain/ports/index'

export class ListDashboardsUseCaseImpl implements ListDashboardsUseCase {
  constructor(
    private readonly listDashboardRepository: ListDashboardsRepository,
    private readonly dateAdapter: DateAdapter
  ) {}

  async perform(input: ListDashboardsUseCaseInput): Promise<ListDashboardsUseCaseOutput> {
    return this.listDashboardRepository.list(input).then((dashboards) =>
      dashboards.map((dashboard) => ({
        slug: dashboard.slug,
        name: dashboard.name,
        description: dashboard.description,
        createdAt: this.dateAdapter.format(dashboard.createdAt),
        updatedAt: this.dateAdapter.format(dashboard.updatedAt),
      }))
    )
  }
}
