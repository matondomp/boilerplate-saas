import { CreateDashboardeUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/create_dashboard/create_dashboard_usecase_impl'
import { CreateDashboardController } from '#modules/admin/settings/dashboard_management/framework/main/controllers/create_dashboard_controller'
import {
  CreateDashboardRespositoryImpl,
  FindDashboardByNameRepositoryImpl,
} from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { UpdateDashboardRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'

export const makeCreateDashboardFactory = (): CreateDashboardController => {
  return new CreateDashboardController(
    new CreateDashboardeUseCaseImpl(
      new CreateDashboardRespositoryImpl(),
      new FindDashboardByNameRepositoryImpl(),
      new UpdateDashboardRepositoryImpl()
    )
  )
}
