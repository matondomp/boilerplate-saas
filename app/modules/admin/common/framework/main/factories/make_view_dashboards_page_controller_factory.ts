import { RetrieveDashboardsRepositoryImpl } from '#modules/admin/common/framework/infra/db/repositories/retrieve_dashboards_repository_impl'
import { ViewDashboardsPageController } from '../controllers/view_dashboards_page_controller.js'
import { RetrieveDashboardsUseCaseImpl } from '#modules/admin/common/usecases/retrieve_dashboards/index'

export const makeViewDashboardsPageControllerFactory = (): ViewDashboardsPageController => {
  return new ViewDashboardsPageController(
    new RetrieveDashboardsUseCaseImpl(new RetrieveDashboardsRepositoryImpl())
  )
}
