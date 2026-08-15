import { ListDashboardDetailsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { ListDashboardDetailsInput } from '#modules/admin/settings/dashboard_management/domain/index'
import { DashboardModel } from '../models/index.js'
import { DashboardDashboarItemsAggregate } from '#modules/admin/settings/dashboard_management/domain/aggregates/dashboard_dashboard_item_aggregate'
import { DashboardDashboardItemsMapper } from '../mappers/dashboard_dashboard_item_mapper.js'

export class ListDashboardDetailsRepositoryImpl implements ListDashboardDetailsRepository {
  constructor(
    private readonly dashboardDashboardItemsMapper: DashboardDashboardItemsMapper = new DashboardDashboardItemsMapper()
  ) {}
  async find(input: ListDashboardDetailsInput): Promise<DashboardDashboarItemsAggregate> {
    const dashboard = await DashboardModel.query()
      .where('slug', input.slug)
      .preload('items', (item) => {
        item.pivotColumns(['width', 'height', 'x', 'y'])
      })
      .first()
    return this.dashboardDashboardItemsMapper.toDomain(dashboard!)
  }
}
