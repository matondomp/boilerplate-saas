import { FindTimezonesRepositoryImpl } from '#shared/framework/infra/db/repositories/in_memory/find_timezones_repository_impl'
import {
  FindNotificationsUseCaseImpl,
  RetrieveTimezonesUseCaseImpl,
} from '#modules/admin/common/usecases/index'
import { FindNotificationsRepositoryImpl, NotificationMapper } from '../../infra/index.js'
import { ShowSettingsPageController } from '../controllers/show_settings_page_controller.js'

export const makeShowSettingsPageControllerFactory = (): ShowSettingsPageController => {
  return new ShowSettingsPageController(
    new FindNotificationsUseCaseImpl(new FindNotificationsRepositoryImpl(new NotificationMapper())),
    new RetrieveTimezonesUseCaseImpl(new FindTimezonesRepositoryImpl())
  )
}
