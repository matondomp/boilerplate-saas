import { Handler } from '#app/listeners/handler'
import { LogInterface } from '#shared/domain/interfaces/index'
import { BroadcastMessageContract } from '#shared/domain/ports/index'
import { CoreBroadcastEnum } from '#shared/domain/types/index'
import { CoreUserModel } from '#shared/framework/infra/index'
import { UserCreatedEvent } from '#modules/admin/settings/acl/users_management/domain/events/user_created_event'

export class LogUserCreatedListener extends Handler {
  constructor(private readonly broadcastMessage: BroadcastMessageContract) {
    super()
  }

  override async handle(event: UserCreatedEvent): Promise<void> {
    const ctx = super.ctx()

    if (!ctx) {
      throw new Error('Context not found')
    }

    const createdUser = await CoreUserModel.query()
      .where('id', event.eventData.userId.toString())
      .firstOrFail()

    const fullLog: any = {
      username: createdUser.slug,
      fullName: createdUser.fullName,
      defaultLang: createdUser.defaultLang,
      createdAt: createdUser.createdAt.toString(),
    }

    this.broadcastMessage.publish<LogInterface>('core.shared.audit.log', {
      type: CoreBroadcastEnum.REGISTER_LOG,
      message: {
        title: 'admin.acl.users.user_created',
        success: true,
        username: ctx.auth.user!.slug,
        source: 'core.acl.users',
        summary: 'admin.acl.users.user_created_summary',
        fullLog: fullLog,
        userId: ctx.auth.user!.id,
        createdAt: event.dateTimeOccurred,
      },
      meta: {
        userId: ctx.auth.user!.id,
      },
    })
  }
}
