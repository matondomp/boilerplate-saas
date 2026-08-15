import { TransactionAdapter } from '#core/ports/index'
import { Job, JobHandlerContract } from '@acidiney/bull-queue/types'

import { MessageBus } from '#shared/domain/ports/message_bus'
import { CoreOutboxMessageModel } from '#shared/framework/infra/db/models/core_outbox_message_model'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'
import Communication from '#shared/framework/infra/adapters/communication'
import { CaptureException } from '#app/exceptions/capture_exception'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class CoreOutboxProcessorJob implements JobHandlerContract<any> {
  constructor(
    private readonly messageBus: MessageBus = Communication.broker,
    private readonly transactionAdapter: TransactionAdapter = new TransactionAdapterImpl()
  ) {}

  async failed(job: Job): Promise<void> {
    await CaptureException.capture(job.failedReason, job)
  }

  async handle() {
    await this.transactionAdapter.useTransaction(async (trx: TransactionClientContract) => {
      const message = await CoreOutboxMessageModel.query({ client: trx })
        .whereNull('sentAt')
        .orderBy('createdAt')
        .forUpdate()
        .skipLocked()
        .first()

      if (!message) {
        return
      }

      await this.messageBus.publish(message.routingKey, {
        type: message.type,
        payload: message.payload,
        $meta: {
          outboxId: message.id,
          userId: message.metaUserId,
        },
      })

      await CoreOutboxMessageModel.query({ client: trx })
        .where({
          id: message.id,
        })
        .update({
          sentAt: new Date(),
        })
    })
  }
}

export default CoreOutboxProcessorJob
