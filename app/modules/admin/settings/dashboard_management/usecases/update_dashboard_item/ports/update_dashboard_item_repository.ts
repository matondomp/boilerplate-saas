import { UpdateDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/update_dashboard_item/index'

export interface UpdateDashboardItemRepository {
  update(input: UpdateDashboardItemUseCaseInput): Promise<void>
}
