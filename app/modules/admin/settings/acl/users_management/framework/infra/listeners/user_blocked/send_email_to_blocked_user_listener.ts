import { join } from 'node:path'
import { Edge } from 'edge.js'
import { Handler } from '#app/listeners/handler'
import { BroadcastMessageContract } from '#shared/domain/ports/index'
import { CoreUserModel } from '#shared/framework/infra/index'
import { UserBlockedEvent } from '../../../../domain/events/user_blocked_event.js'
import { SendEmailProps } from '#shared/framework/infra/jobs/core_send_email_job'
import { CoreBroadcastEnum } from '#shared/domain/types/core_broadcast_enum'

export class SendEmailToBlockedUserListener extends Handler {
  constructor(private readonly broadcastMessage: BroadcastMessageContract) {
    super()
  }

  async handle(event: UserBlockedEvent): Promise<void> {
    const user = await CoreUserModel.findOrFail(event.eventData.userId.toString())

    const ctx = super.ctx()

    if (!ctx) {
      return
    }
    const edge = new Edge()

    edge.mount(join((import.meta as any).dirname, '..', '..', './resources'))

    const html = await edge.render(`${user.defaultLang}/user_blocked`)

    this.broadcastMessage.publish<SendEmailProps>('core.shared', {
      type: CoreBroadcastEnum.SEND_EMAIL,
      message: {
        to: user.email,
        content: html,
        subject: ctx.i18n.formatMessage('admin.settings.user_blocked_subject'),
        lang: user.defaultLang,
      },
      meta: {
        userId: user.id,
      },
    })
  }
}
