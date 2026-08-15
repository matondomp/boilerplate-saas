import { ExecuteItemQueryRepository } from './../execute_item_query/ports/execute_item_query_repository.js'
import {
  ListDashboardItemsUseCase,
  ListDashboardItemsUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/index'
import { ListDashboardItemsRepository } from './ports/index.js'

export class ListDashboardItemsUseCaseImpl implements ListDashboardItemsUseCase {
  constructor(
    private readonly listDashboardRepository: ListDashboardItemsRepository,
    private readonly executeItemQueryRepository: ExecuteItemQueryRepository
  ) {}

  async perform(): Promise<ListDashboardItemsUseCaseOutput> {
    let itemsList = await this.listDashboardRepository.list()

    return await Promise.all(
      itemsList.map(async (item) => ({
        id: item.id.toString(),
        name: item.name,
        chartType: item.chartType,
        queryResult: await this.executeItemQueryRepository.execute({ sqlRaw: item.sqlRaw }),
      }))
    )
  }
}
