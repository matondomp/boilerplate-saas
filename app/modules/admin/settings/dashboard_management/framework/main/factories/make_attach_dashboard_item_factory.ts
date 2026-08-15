import { AttachDashboardItemUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import {
  FindDashboardBySlugRepositoryImpl,
  FindDashboardItemByIdRepositoryImpl,
} from '#modules/admin/settings/dashboard_management/framework/infra/db/repositories/index'
import { AttachDashboardItemRepositoryImpl } from '../../infra/db/repositories/attach_dashboard_item_repository_impl.js'
import { AttachDashboardItemController } from '../controllers/attach_dashboard_item_controller.js'

export const makeAttachDashboardItemFactory = (): AttachDashboardItemController => {
  return new AttachDashboardItemController(
    new AttachDashboardItemUseCaseImpl(
      new FindDashboardBySlugRepositoryImpl(),
      new FindDashboardItemByIdRepositoryImpl(),
      new AttachDashboardItemRepositoryImpl()
    )
  )
}
