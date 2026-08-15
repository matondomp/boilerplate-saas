import {
  RetrieveNewestNotificationsUseCase,
  RetrieveNewestNotificationsUseCaseInput,
  RetrieveNewestNotificationsUseCaseOutput,
} from '#modules/admin/common/domain/index'
import {
  NotificationsWithCount,
  RetrieveUserNotificationsRepository,
} from '#modules/admin/common/usecases/index'
import { UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { NotificationEntity } from '#shared/domain/entities/notification_entity'

export class RetrieveNewestNotificationsUseCaseImpl implements RetrieveNewestNotificationsUseCase {
  constructor(
    private readonly retrieveUserNotificationsRepository: RetrieveUserNotificationsRepository,
    private readonly dateAdapter: DateAdapter
  ) {}

  async perform(
    input: RetrieveNewestNotificationsUseCaseInput
  ): Promise<RetrieveNewestNotificationsUseCaseOutput> {
    const userNotifications = (await this.retrieveUserNotificationsRepository.findAll(
      new UniqueEntityID(input.userId),
      {
        hideOpenedNotifications: input.hideOpenedNotifications || true,
        page: input.page,
        perPage: input.perPage,
        withPagination: input.withPagination,
        orderDirection: input.orderDirection,
      }
    )) as NotificationsWithCount

    return {
      unRead: userNotifications.unRedead,
      notifications: userNotifications.notifications.map((uN: NotificationEntity) => ({
        routePath: uN.routePath,
        title: uN.subject,
        message: uN.message,
        icon: uN.icon,
        eventType: uN.eventType,
        hash: uN.id.toString(),
        event: uN.event,
        createdAt: this.dateAdapter.format(uN.createdAt),
        createdAtText: this.dateAdapter.toRelative(uN.createdAt),
      })),
    }
  }
}
