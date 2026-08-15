import { CreateDashboardItemUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/create_dashboard_item/index'
import { CreateDashboardItemController } from '#modules/admin/settings/dashboard_management/framework/main/controllers/create_dashboard_item_controller'
import { CreateDashboardItemRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'

export const makeCreateDashboardItemFactory = (): CreateDashboardItemController => {
  return new CreateDashboardItemController(
    new CreateDashboardItemUseCaseImpl(new CreateDashboardItemRepositoryImpl())
  )
}
