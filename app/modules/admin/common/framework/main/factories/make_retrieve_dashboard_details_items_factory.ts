import { RetrieveDashboardItemsUseCaseImpl } from '#modules/admin/common/usecases/retrieve_dashboard_items/retrieve_dashboard_items_usecase_impl'
import { FindDashboardBySlugRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { ExecuteItemQueryRepositoryImpl } from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { RetrieveDashboardItemsController } from '../controllers/retrieve_dashboard_items_controller.js'
import { RetrieveDashboardItemsRepositoryImpl } from '#modules/admin/common/framework/infra/db/repositories/index'

export const makeRetrieveDashboardDetailsControllerFactory =
  (): RetrieveDashboardItemsController => {
    return new RetrieveDashboardItemsController(
      new RetrieveDashboardItemsUseCaseImpl(
        new RetrieveDashboardItemsRepositoryImpl(),
        new FindDashboardBySlugRepositoryImpl(),
        new ExecuteItemQueryRepositoryImpl()
      )
    )
  }
