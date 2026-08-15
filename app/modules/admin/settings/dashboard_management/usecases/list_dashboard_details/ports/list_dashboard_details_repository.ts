import { ListDashboardDetailsInput } from '#modules/admin/settings/dashboard_management/domain/index'
import { DashboardDashboarItemsAggregate } from '#modules/admin/settings/dashboard_management/domain/aggregates/dashboard_dashboard_item_aggregate'

export interface ListDashboardDetailsRepository {
  find(input: ListDashboardDetailsInput): Promise<DashboardDashboarItemsAggregate>
}
