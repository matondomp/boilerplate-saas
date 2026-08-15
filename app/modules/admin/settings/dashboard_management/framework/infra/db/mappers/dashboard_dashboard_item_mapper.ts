import { Mapper } from '#core/domain/index'
import { DashboardDashboarItemsAggregate } from '#modules/admin/settings/dashboard_management/domain/aggregates/index'
import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'
import { DashboardMapper } from './dashboard_mapper.js'
import { DashboardItemMapper } from './dashboard_item_mapper.js'

export class DashboardDashboardItemsMapper extends Mapper<
  DashboardDashboarItemsAggregate,
  DashboardModel
> {
  constructor(
    private readonly dashboardMapper: DashboardMapper = new DashboardMapper(),
    private readonly dashbardItemMapper: DashboardItemMapper = new DashboardItemMapper()
  ) {
    super()
  }

  toDomain(dashboardModel: DashboardModel): DashboardDashboarItemsAggregate {
    const dashboardEntity = this.dashboardMapper.toDomain(dashboardModel)
    const dashboarditemsEntity = dashboardModel.items.map((item) =>
      this.dashbardItemMapper.toDomain(item)
    )

    return DashboardDashboarItemsAggregate.hydrate({
      dashboard: dashboardEntity,
      dashboardItems: dashboarditemsEntity,
    })
  }

  toPersistence(_: DashboardDashboarItemsAggregate): DashboardModel {
    throw new Error('Method not implemented.')
  }
}
