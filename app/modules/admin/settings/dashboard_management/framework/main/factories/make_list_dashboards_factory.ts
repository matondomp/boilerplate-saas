import { ListDashboardsController } from '../controllers/list_dashboards_controller.js'
import { DateAdapterImpl } from '#shared/framework/infra/index'
import { ListDashboardsRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/list_dashboards_repository_impl'
import { ListDashboardsUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/list_dashboards/list_dashboards_usecase_impl'

export const makeListDashboardsFactory = (): ListDashboardsController => {
  return new ListDashboardsController(
    new ListDashboardsUseCaseImpl(new ListDashboardsRepositoryImpl(), new DateAdapterImpl())
  )
}
