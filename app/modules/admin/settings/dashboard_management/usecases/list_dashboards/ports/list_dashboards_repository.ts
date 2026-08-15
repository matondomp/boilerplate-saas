import { ListDashboardsUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export interface ListDashboardsRepository {
  list(input: ListDashboardsUseCaseInput): Promise<DashboardEntity[]>
}
