import { UpdateDashboardUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { FindDashboardBySlugRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { UpdateDashboardController } from '#modules/admin/settings/dashboard_management/framework/main/controllers/update_dashboard_controller'
import { UpdateDashboardRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'

export const makeUpdateDashboardFactory = (): UpdateDashboardController => {
  return new UpdateDashboardController(
    new UpdateDashboardUseCaseImpl(
      new FindDashboardBySlugRepositoryImpl(),
      new UpdateDashboardRepositoryImpl()
    )
  )
}
