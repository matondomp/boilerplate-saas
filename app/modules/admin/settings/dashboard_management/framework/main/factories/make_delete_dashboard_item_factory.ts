import { DeleteDashboardItemRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { DeleteDashboardItemUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DeleteDashboardItemController } from '../controllers/delete_dashboard_item_controller.js'
import { FindDashboardItemByIdRepositoryImpl } from '../../infra/db/repositories/index.js'

export const makeDeleteDashboardItemFactory = () => {
  return new DeleteDashboardItemController(
    new DeleteDashboardItemUseCaseImpl(
      new FindDashboardItemByIdRepositoryImpl(),
      new DeleteDashboardItemRepositoryImpl()
    )
  )
}
