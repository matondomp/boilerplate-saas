import { ExecuteItemQueryRepository } from './../execute_item_query/ports/execute_item_query_repository.js'
import { FindDashboardBySlugRepository } from './../find_dashboard/ports/find_dashboard_repository.js'
import {
  ListDashboardDetailsInput,
  ListDashboardDetailsOutput,
  ListDashboardDetailsUseCase,
} from '#modules/admin/settings/dashboard_management/domain/index'
import { ListDashboardDetailsRepository } from './ports/index.js'
import { DashboardNotFoundError } from '../../domain/errors/dashboard_not_found_error.js'
import { Either, left, right } from '#core/domain/index'

export class ListDashboardDetailsUseCaseImpl implements ListDashboardDetailsUseCase {
  constructor(
    private readonly listDashboardDetailsRepository: ListDashboardDetailsRepository,
    private readonly findDashboardBySlugRepository: FindDashboardBySlugRepository,
    private readonly executeItemQueryRepository: ExecuteItemQueryRepository
  ) {}

  async perform(
    input: ListDashboardDetailsInput
  ): Promise<Either<DashboardNotFoundError, ListDashboardDetailsOutput>> {
    const dashboard = await this.findDashboardBySlugRepository.find(input.slug)

    if (!dashboard) {
      return left(new DashboardNotFoundError())
    }

    const dashboarDetails = await this.listDashboardDetailsRepository.find(input)
    return right({
      dashboard: {
        name: dashboarDetails.dashboard.name,
        slug: dashboarDetails.dashboard.slug,
        description: dashboarDetails.dashboard.description,
        id: dashboarDetails.dashboard.id.toString(),
      },
      items: await Promise.all(
        dashboarDetails.dashboardItems.map(async (item) => ({
          id: item.id.toString(),
          name: item.name,
          chartType: item.chartType,
          slug: item.slug,
          width: item.width!,
          height: item.height!,
          x: item.x!,
          y: item.y!,
          queryResult: await this.executeItemQueryRepository.execute({ sqlRaw: item.sqlRaw }),
        }))
      ),
    })
  }
}
