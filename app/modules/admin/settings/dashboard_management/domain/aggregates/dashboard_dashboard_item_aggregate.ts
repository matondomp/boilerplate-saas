import { AggregateRoot } from '#core/domain/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { DashboardItemEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export interface DashboardDashboardItemsProps {
  dashboard: DashboardEntity
  dashboardItems: DashboardItemEntity[]
}

export class DashboardDashboarItemsAggregate extends AggregateRoot<DashboardDashboardItemsProps> {
  get dashboard(): DashboardEntity {
    return this.props.dashboard
  }

  get dashboardItems(): DashboardItemEntity[] {
    return this.props.dashboardItems
  }

  static hydrate(props: DashboardDashboardItemsProps): DashboardDashboarItemsAggregate {
    return new DashboardDashboarItemsAggregate(props)
  }
}
