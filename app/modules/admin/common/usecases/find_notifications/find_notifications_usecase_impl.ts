import {
  FindNotificationsUseCase,
  FindNotificationsUseCaseOutput,
} from '../../domain/usecases/index.js'
import { FindNotificationsRepository } from './ports/index.js'

export class FindNotificationsUseCaseImpl implements FindNotificationsUseCase {
  constructor(private readonly findNotificationsRepository: FindNotificationsRepository) {}

  async perform({ userId }: { userId: string }): Promise<FindNotificationsUseCaseOutput> {
    const notifications = await this.findNotificationsRepository.findAll()
    const activeNotifications =
      await this.findNotificationsRepository.findActiveNotifications(userId)

    return {
      notifications: notifications.map((n) => ({
        id: n.id.toString(),
        title: n.name,
      })),
      activeNotifications: activeNotifications.map((n) => ({
        id: n.id.toString(),
        type: n.type,
      })),
    }
  }
}
