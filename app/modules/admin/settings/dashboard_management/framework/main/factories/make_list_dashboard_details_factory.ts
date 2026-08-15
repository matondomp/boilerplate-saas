import {
  FindDashboardBySlugRepositoryImpl,
  ListDashboardDetailsRepositoryImpl,
} from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { ListDashboardDetailsUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { ListDashboardDetailsController } from '#modules/admin/settings/dashboard_management/framework/main/controllers/list_dashboard_details_controller'
import { ExecuteItemQueryRepositoryImpl } from '../../infra/db/repositories/execute_item_query_repository_impl.js'

export const makeListDashboardDetailsFactory = (): ListDashboardDetailsController => {
  return new ListDashboardDetailsController(
    new ListDashboardDetailsUseCaseImpl(
      new ListDashboardDetailsRepositoryImpl(),
      new FindDashboardBySlugRepositoryImpl(),
      new ExecuteItemQueryRepositoryImpl()
    )
  )
}
