import Encryption from '@adonisjs/core/services/encryption'
import { BroadcastMessageContract, EmailAdapter } from '#shared/domain/ports/index'
import { CoreBroadcastEnum } from '#shared/domain/types/index'
import env from '#start/env'
import { Handler } from '#app/listeners/handler'
import { PasswordChangedEvent } from '#shared/domain/events/password_changed_event'
import { CoreUserModel, DateAdapterImpl } from '../index.js'

export class SendPasswordChangedEmailListener extends Handler {
  constructor(
    private readonly broadcastMessage: BroadcastMessageContract,
    private readonly emailAdapter: EmailAdapter
  ) {
    super()
  }

  override async handle(event: PasswordChangedEvent): Promise<void> {
    const userModel = await CoreUserModel.query()
      .where('id', event.eventData.userId.toString())
      .firstOrFail()

    const appName = env.get('APP_NAME')

    const html = await this.emailAdapter.render(`${userModel.defaultLang}/password_changed`, {
      name: userModel.fullName,
      plataform: appName,
      hash: Encryption.encrypt(env.get('APP_KEY')),
    })

    await this.broadcastMessage.publish('core.shared', {
      type: CoreBroadcastEnum.SEND_EMAIL,
      message: {
        content: html,
        subject: 'auth.request_password.request',
        to: userModel.email,
        date: new DateAdapterImpl().format(event.dateTimeOccurred),
      },
      meta: {
        userId: userModel.id,
      },
    })
  }
}
