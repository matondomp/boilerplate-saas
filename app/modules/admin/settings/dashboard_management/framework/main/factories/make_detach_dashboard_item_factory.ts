import { DetachDashboardItemUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import {
  FindDashboardBySlugRepositoryImpl,
  FindDashboardItemByIdRepositoryImpl,
} from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { DetachDashboardItemRepositoryImpl } from '../../infra/db/repositories/detach_dashboard_item_repository_impl.js'
import { DetachDashboardItemController } from '../controllers/detach_dashboard_item_controller.js'

export const makeDetachDashboardItemFactory = (): DetachDashboardItemController => {
  return new DetachDashboardItemController(
    new DetachDashboardItemUseCaseImpl(
      new FindDashboardBySlugRepositoryImpl(),
      new FindDashboardItemByIdRepositoryImpl(),
      new DetachDashboardItemRepositoryImpl()
    )
  )
}
