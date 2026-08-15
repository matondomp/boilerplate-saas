import { InboxProcessorContract } from '#shared/domain/ports/inbox_processor_contract'
import { CoreBroadcastEnum } from '#shared/domain/types/core_broadcast_enum'
import { Job, JobHandlerContract } from '@acidiney/bull-queue/types'
import { SendEmailProcessor } from '../inbox_processor/send_email_processor.js'
import { SaveNotificationProcessor } from '../inbox_processor/save_notification_processor.js'
import { SaveActivityProcessor } from '../inbox_processor/save_activity_processor.js'
import { HashDriverAdapterImpl } from '#modules/auth/framework/infra/adapters/hash_driver_adapter_impl'
import { SaveLogProcessor } from '#shared/framework/infra/inbox_processor/save_log_processor'
import { TransactionAdapter } from '#core/ports/transaction_adapter'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'
import { CoreInboxMessagesModel } from '../db/models/core_inbox_messages_model.js'
import { StatusEnum } from '#shared/domain/types/status_type'
import { BroadcastMessageRepositoryImpl, CoreOutboxMessageModel } from '../index.js'
import { CaptureException } from '#app/exceptions/capture_exception'

interface ProcessorContract {
  [key: string]: InboxProcessorContract<any>
}

export class CoreSharedInboxProcessor implements JobHandlerContract<ProcessorContract> {
  key: string = CoreSharedInboxProcessor.name

  private readonly contracts: ProcessorContract = {
    [CoreBroadcastEnum.SEND_EMAIL]: new SendEmailProcessor(),
    [CoreBroadcastEnum.NOTIFY]: new SaveNotificationProcessor(
      new HashDriverAdapterImpl(),
      new BroadcastMessageRepositoryImpl()
    ),
    [CoreBroadcastEnum.REGISTER_LOG]: new SaveLogProcessor(),
    [CoreBroadcastEnum.TRACK_ACTIVITY]: new SaveActivityProcessor(new HashDriverAdapterImpl()),
  }

  constructor(
    private readonly transactionAdapter: TransactionAdapter = new TransactionAdapterImpl()
  ) {}

  async failed(job: Job): Promise<void> {
    await CaptureException.capture(job.failedReason, job)
  }

  async handle(): Promise<void> {
    await this.transactionAdapter.useTransaction(async (trx) => {
      const message = await CoreInboxMessagesModel.query({ client: trx })
        .forUpdate()
        .skipLocked()
        .where({
          responsible: 'CORE_SHARED',
          complete: false,
          status: StatusEnum.PENDING,
        })
        .first()

      if (!message) {
        return
      }

      const contract = this.contracts[message.type]

      if (!contract) {
        throw new Error(`Contract ${message.type} not implemented!`)
      }

      const result = await contract.perform({
        ...message.payload,
        userId: message.metaUserId,
        inboxId: message.id,
      })

      if (result && result === 'QUEUED') {
        await CoreInboxMessagesModel.query({ client: trx })
          .where({
            id: message.id,
          })
          .update({
            status: StatusEnum.STARTED,
          })

        return
      }

      await CoreOutboxMessageModel.query({ client: trx })
        .where({
          id: message.metaOutboxId,
        })
        .delete()

      await message.delete()
    })
  }
}

export default CoreSharedInboxProcessor
