import { ClearMessageContract } from '#shared/domain/ports/index'
import { CoreOutboxMessageModel } from '#shared/framework/infra/db/models/core_outbox_message_model'

export class ClearMessageRepositoryImpl implements ClearMessageContract {
  async clear(messageId: string): Promise<void> {
    await CoreOutboxMessageModel.query().where('id', messageId).delete()
  }
}
