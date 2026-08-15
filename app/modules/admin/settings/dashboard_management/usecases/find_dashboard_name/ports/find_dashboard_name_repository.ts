import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export interface FindDashboardByNameRepository {
  find(input: string): Promise<DashboardEntity | undefined>
}
