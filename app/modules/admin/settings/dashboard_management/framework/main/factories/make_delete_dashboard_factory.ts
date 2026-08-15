import {
  FindDashboardBySlugRepositoryImpl,
  UpdateDashboardRepositoryImpl,
} from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { DeleteDashboardController } from '#modules/admin/settings/dashboard_management/framework/main/controllers/delete_dashboard_controller'
import { DeleteDashboardUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'

export const makeDeleteDashboardFactory = () => {
  return new DeleteDashboardController(
    new DeleteDashboardUseCaseImpl(
      new FindDashboardBySlugRepositoryImpl(),
      new UpdateDashboardRepositoryImpl()
    )
  )
}
