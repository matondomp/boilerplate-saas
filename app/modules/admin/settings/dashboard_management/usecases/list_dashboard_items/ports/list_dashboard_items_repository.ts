import { DashboardItemEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export interface ListDashboardItemsRepository {
  list(): Promise<DashboardItemEntity[]>
}
