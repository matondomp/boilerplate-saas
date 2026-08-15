import { UpdateDefaultDashboardRepositoryImpl } from './../../infra/db/repositories/update_default_dashboard_repository_impl.js'
import { UpdateDefaultDashboardUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { FindDashboardBySlugRepositoryImpl } from '../../infra/db/repositories/index.js'
import { UpdateDefaultDashboardController } from '../controllers/update_default_dashboard_controller.js'

export const makeUpdateDefaultDashboardFactory = (): UpdateDefaultDashboardController => {
  return new UpdateDefaultDashboardController(
    new UpdateDefaultDashboardUseCaseImpl(
      new FindDashboardBySlugRepositoryImpl(),
      new UpdateDefaultDashboardRepositoryImpl()
    )
  )
}
