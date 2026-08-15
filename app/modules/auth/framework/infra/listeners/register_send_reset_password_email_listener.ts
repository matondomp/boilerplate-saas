import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { Handler } from '#app/listeners/handler'
import { LogInterface } from '#shared/domain/interfaces/index'
import { BroadcastMessageContract } from '#shared/domain/ports/broadcast_message_contract'
import { CoreBroadcastEnum } from '#shared/domain/types/index'
import { SentResetPasswordEvent } from '#modules/auth/domain/events/sent_reset_password_event'

export class RegisterSendResetPasswordEmailListener extends Handler {
  constructor(private readonly broadcastMessage: BroadcastMessageContract) {
    super()
  }

  override async handle(event: SentResetPasswordEvent): Promise<void> {
    const userModel = await CoreUserModel.query()
      .where('id', event.eventData.userId.toString())
      .firstOrFail()

    const fullLog: any = {
      username: userModel.slug,
      fullName: userModel.fullName,
      defaultLang: userModel.defaultLang,
    }

    this.broadcastMessage.publish<LogInterface>('core.shared.audit.log', {
      type: CoreBroadcastEnum.REGISTER_LOG,
      message: {
        title: 'auth.reset.send_reset_password',
        success: true,
        username: userModel.slug,
        source: 'core.auth',
        summary: 'auth.reset.send_reset_password_description',
        fullLog: fullLog,
        userId: userModel.id,
        createdAt: event.dateTimeOccurred,
      },
      meta: {
        userId: userModel.id,
      },
    })
  }
}
