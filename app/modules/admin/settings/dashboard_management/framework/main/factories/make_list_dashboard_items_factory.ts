import { ExecuteItemQueryRepositoryImpl } from './../../infra/db/repositories/execute_item_query_repository_impl.js'
import { ListDashboardItemsRepositoryImpl } from './../../infra/db/repositories/index.js'
import { ListDashboardItemsUseCaseImpl } from './../../../usecases/index.js'
import { ListDashboardItemsController } from '../controllers/list_dashboard_items_controller.js'

export const makeListDashboardItemsFactory = (): ListDashboardItemsController => {
  return new ListDashboardItemsController(
    new ListDashboardItemsUseCaseImpl(
      new ListDashboardItemsRepositoryImpl(),
      new ExecuteItemQueryRepositoryImpl()
    )
  )
}
