import { DashboardItemMapper } from '#modules/admin/settings/dashboard_management/framework/infra/db/mappers/dashboard_item_mapper'
import { RetrieveDashboardItemsUseCaseInput } from '#modules/admin/common/domain/usecases/retrieve_dashboard_items/retrieve_dashboard_items_usecase_input'
import { RetrieveDashboardItemsRepository } from '#modules/admin/common/usecases/retrieve_dashboard_items/ports/index'
import { DashboardItemEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'

export class RetrieveDashboardItemsRepositoryImpl implements RetrieveDashboardItemsRepository {
  constructor(
    private readonly dashboardItemMapper: DashboardItemMapper = new DashboardItemMapper()
  ) {}
  async retrieve(input: RetrieveDashboardItemsUseCaseInput): Promise<DashboardItemEntity[]> {
    const dashboard = await DashboardModel.query()
      .where('slug', input.dashboardSlug)
      .preload('items', (item) => {
        item.pivotColumns(['width', 'height', 'x', 'y'])
      })
      .first()

    return dashboard!.items.map((item) => this.dashboardItemMapper.toDomain(item))
  }
}
