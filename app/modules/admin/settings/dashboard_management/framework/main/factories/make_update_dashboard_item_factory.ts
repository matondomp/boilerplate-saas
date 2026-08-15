import { FindDashboardItemByIdRepositoryImpl } from './../../infra/db/repositories/find_dashboard_item_repository_impl.js'
import { UpdateDashboardItemRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { UpdateDashboardItemUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDashboardItemController } from '#modules/admin/settings/dashboard_management/framework/main/controllers/update_dashboard_item_controller'

export const makeUpdateDashboardItemFactory = (): UpdateDashboardItemController => {
  return new UpdateDashboardItemController(
    new UpdateDashboardItemUseCaseImpl(
      new UpdateDashboardItemRepositoryImpl(),
      new FindDashboardItemByIdRepositoryImpl()
    )
  )
}
