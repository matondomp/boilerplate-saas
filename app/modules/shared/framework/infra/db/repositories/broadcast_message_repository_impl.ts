import { BroadcastMessage, BroadcastMessageContract } from '#shared/domain/ports/index'
import { CoreOutboxMessageModel } from '#shared/framework/infra/db/models/core_outbox_message_model'

export class BroadcastMessageRepositoryImpl implements BroadcastMessageContract {
  async publish(routeName: string, info: BroadcastMessage<any>): Promise<void> {
    await CoreOutboxMessageModel.create({
      routingKey: routeName,
      type: info.type,
      payload: info.message,
      metaUserId: info.meta.userId,
      sentAt: null,
    })
  }
}
