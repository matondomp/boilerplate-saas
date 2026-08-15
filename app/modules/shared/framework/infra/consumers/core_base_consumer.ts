import Communication from '#shared/framework/infra/adapters/communication'

import { TransactionAdapter } from '#core/ports/index'
import { Message } from '#shared/domain/ports/message_bus'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'
import { CoreInboxMessagesModel } from '../db/models/core_inbox_messages_model.js'
import { BaseModel } from '@adonisjs/lucid/orm'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
/**
 * @description The base consumer auto call itset in his constructor
 */
export class CoreBaseConsumer {
  constructor(
    private readonly key: string,
    private readonly responsible: string,
    private readonly inboxModel: typeof BaseModel = CoreInboxMessagesModel,
    private readonly transactionAdapter: TransactionAdapter = new TransactionAdapterImpl(),
    private readonly messageBusService = Communication.broker
  ) {
    this.messageBusService.consume(this.key, this.handle.bind(this))
  }

  protected async handle(message: Message, ack: () => void): Promise<void> {
    await this.transactionAdapter.useTransaction(async (trx: TransactionClientContract) => {
      const messageInbox = await this.inboxModel
        .query({ client: trx })
        .where({ metaOutboxId: message.$meta.outboxId })
        .first()

      if (messageInbox) {
        return
      }

      await this.inboxModel.create(
        {
          responsible: this.responsible,
          type: message.type,
          payload: message.payload,
          metaUserId: message.$meta.userId,
          metaOutboxId: message.$meta.outboxId,
          complete: false,
          status: 'PENDING',
        },
        {
          client: trx,
        }
      )
    })

    await ack()
  }
}
