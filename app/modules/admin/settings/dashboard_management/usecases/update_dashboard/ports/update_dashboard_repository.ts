import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export interface UpdateDashboardRepository {
  update(input: DashboardEntity): Promise<void>
}
