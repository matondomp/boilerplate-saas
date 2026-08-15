import Encryption from '@adonisjs/core/services/encryption'
import { Handler } from '#app/listeners/handler'
import { BroadcastMessageContract, EmailAdapter } from '#shared/domain/ports/index'
import { CoreBroadcastEnum } from '#shared/domain/types/core_broadcast_enum'
import { CoreUserModel, DateAdapterImpl } from '#shared/framework/infra/index'
import { UserCreatedEvent } from '#modules/admin/settings/acl/users_management/domain/events/user_created_event'
import env from '#start/env'

export class UserCreatedListener extends Handler {
  constructor(
    private readonly broadcastMessage: BroadcastMessageContract,
    private readonly emailAdapter: EmailAdapter
  ) {
    super()
  }

  override async handle(event: UserCreatedEvent): Promise<void> {
    const userModel = await CoreUserModel.query()
      .where('id', event.eventData.userId.toString())
      .firstOrFail()

    const appName = env.get('APP_NAME')

    const html = await this.emailAdapter.render(`${userModel.defaultLang}/user_created`, {
      name: userModel.fullName,
      password: event.eventData.password,
      plataform: appName,
      hash: Encryption.encrypt(env.get('APP_KEY')),
    })

    await this.broadcastMessage.publish('core.shared', {
      type: CoreBroadcastEnum.SEND_EMAIL,
      message: {
        content: html,
        subject: 'admin.acl.users.user_created',
        to: userModel.email,
        date: new DateAdapterImpl().format(event.dateTimeOccurred),
      },
      meta: {
        userId: userModel.id,
      },
    })
  }
}
