import { RetrieveDashboardItemsUseCase } from '#modules/admin/common/domain/usecases/retrieve_dashboard_items/retrieve_dashboard_items_usecase'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard/ports/index'
import { RetrieveDashboardItemsUseCaseInput } from '#modules/admin/common/domain/usecases/retrieve_dashboard_items/retrieve_dashboard_items_usecase_input'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'
import { RetrieveDashboardItemsUseCaseOutput } from '#modules/admin/common/domain/usecases/retrieve_dashboard_items/retrieve_dashboard_items_usecase_output'
import { ExecuteItemQueryRepository } from '#modules/admin/settings/dashboard_management/usecases/execute_item_query/index'
import { Either, left, right } from '#core/domain/index'
import { RetrieveDashboardItemsRepository } from './ports/index.js'

export class RetrieveDashboardItemsUseCaseImpl implements RetrieveDashboardItemsUseCase {
  constructor(
    private readonly retrieveDashboardItemsRepository: RetrieveDashboardItemsRepository,
    private readonly findDashboardBySlugRepository: FindDashboardBySlugRepository,
    private readonly executeItemQueryRepository: ExecuteItemQueryRepository
  ) {}

  async perform(
    input: RetrieveDashboardItemsUseCaseInput
  ): Promise<Either<DashboardNotFoundError, RetrieveDashboardItemsUseCaseOutput>> {
    const dashboard = await this.findDashboardBySlugRepository.find(input.dashboardSlug)

    if (!dashboard) {
      return left(new DashboardNotFoundError())
    }

    return right(
      await this.retrieveDashboardItemsRepository.retrieve(input).then(async (items) => {
        return await Promise.all(
          items.map(async (item) => ({
            name: item.name,
            chartType: item.chartType,
            width: item.width!,
            height: item.height!,
            x: item.x!,
            y: item.y!,
            queryResult: await this.executeItemQueryRepository.execute({ sqlRaw: item.sqlRaw }),
          }))
        )
      })
    )
  }
}
