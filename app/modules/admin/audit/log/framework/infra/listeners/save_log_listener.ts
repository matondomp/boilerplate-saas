import { BroadcastMessageContract } from '#shared/domain/ports/broadcast_message_contract'
import { CoreBroadcastEnum } from '#shared/domain/types/core_broadcast_enum'
import { LogInterface } from '#modules/admin/audit/log/domain/interfaces/index'
import { Handler } from '#app/listeners/handler'
import { DomainActionExecutedEvent } from '../../../domain/events/domain_action_executed_event.js'

export class SaveLogListener extends Handler {
  constructor(private readonly broadcastMessage: BroadcastMessageContract) {
    super()
  }

  async handle(event: DomainActionExecutedEvent): Promise<void> {
    const data = event.eventData

    this.broadcastMessage.publish<LogInterface>('core.shared.audit.log', {
      type: CoreBroadcastEnum.REGISTER_LOG,
      message: {
        title: data.title,
        success: data.success,
        errorMessage: data.errorMessage,
        username: data.username,
        source: data.source,
        summary: data.summary,
        fullLog: data.fullLog,
        userId: data.userId,
        createdAt: data.createdAt,
      },
      meta: {
        userId: data.userId,
      },
    })
  }
}
