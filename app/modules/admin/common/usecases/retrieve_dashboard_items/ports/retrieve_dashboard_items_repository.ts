import { RetrieveDashboardItemsUseCaseInput } from '#modules/admin/common/domain/usecases/index'
import { DashboardItemEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export interface RetrieveDashboardItemsRepository {
  retrieve(input: RetrieveDashboardItemsUseCaseInput): Promise<DashboardItemEntity[]>
}
