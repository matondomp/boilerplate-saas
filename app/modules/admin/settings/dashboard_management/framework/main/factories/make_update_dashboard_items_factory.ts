import { UpdateDashboardItemsRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { UpdateDashboardItemsUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDashboardItemsController } from '#modules/admin/settings/dashboard_management/framework/main/controllers/update_dashboard_items_controller'

export const makeUpdateDashboardItemsFactory = (): UpdateDashboardItemsController => {
  return new UpdateDashboardItemsController(
    new UpdateDashboardItemsUseCaseImpl(new UpdateDashboardItemsRepositoryImpl())
  )
}
