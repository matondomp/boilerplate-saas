import type {
  UpdateDashboardItemsUseCaseOuput,
  UpdateDashboardItemsUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/update_dashboard_items/index'

export interface UpdateDashboardItemsRepository {
  update(input: UpdateDashboardItemsUseCaseInput): Promise<UpdateDashboardItemsUseCaseOuput>
}
