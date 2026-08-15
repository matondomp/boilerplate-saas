import { RetrieveNewestNotificationsController } from '#modules/admin/common/framework/main/controllers/retrieve_newest_notifications_controller'
import { RetrieveNewestNotificationsUseCaseImpl } from '#modules/admin/common/usecases/index'
import { RetrieveUserNewestNotificationsRepositoryImpl } from '#modules/admin/common/framework/infra/db/repositories/retrieve_user_newest_notifications_repository_impl'
import { UserNotificationMapper } from '#shared/framework/infra/db/mappers/index'
import { DateAdapterImpl } from '#shared/framework/infra/index'

export const makeRetrieveNewestNotificationsControllerFactory =
  (): RetrieveNewestNotificationsController => {
    return new RetrieveNewestNotificationsController(
      new RetrieveNewestNotificationsUseCaseImpl(
        new RetrieveUserNewestNotificationsRepositoryImpl(new UserNotificationMapper()),
        new DateAdapterImpl()
      )
    )
  }
