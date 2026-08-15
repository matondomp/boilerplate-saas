import emitter from '@adonisjs/core/services/emitter'

import { UniqueEntityID } from '#core/domain/index'
import { HashAdapter } from '#modules/auth/usecases/index'
import { BroadcastMessageContract, InboxProcessorContract } from '#shared/domain/ports/index'
import { EventType } from '#shared/domain/entities/notification_entity'
import { CoreUserModel, CoreNotificationEventModel } from '#shared/framework/infra/db/index'
import env from '#start/env'
import { CoreBroadcastEnum } from '#shared/domain/types/index'
import { SendEmailProps } from '../jobs/core_send_email_job.js'

export interface SaveNotificationProps {
  title: string
  message: string
  content: string
  routePath: string
  event: string
  eventType: EventType
  notificationType: string
  date: Date
}

interface NotificationProps extends SaveNotificationProps {
  userId: UniqueEntityID
}
export class SaveNotificationProcessor implements InboxProcessorContract<NotificationProps> {
  constructor(
    private readonly hashDriver: HashAdapter,
    private readonly broadcastMessage: BroadcastMessageContract
  ) {}

  private readonly contract = {
    email: this.notifyViaEmail.bind(this),
    platform: this.notifyViaPlatform.bind(this),
  }

  private async notifyViaPlatform(input: NotificationProps, user: CoreUserModel): Promise<void> {
    await CoreNotificationEventModel.insertOne({
      userId: user.id,
      title: input.title,
      message: input.message ?? '',
      routePath: input.routePath,
      hash: await this.hashDriver.generate(env.get('APP_KEY'), user.id),
      readAt: null,
      event: input.event,
      eventType: input.eventType,
      createdAt: input.date,
      updatedAt: input.date,
    })

    void emitter.emit<any>('alert:realtime:broadcast:only', {
      eventName: input.event,
      title: input.title,
      message: input.message,
      users: [user.slug],
      type: input.eventType ?? 'info',
    })
  }

  private async notifyViaEmail(input: NotificationProps, user: CoreUserModel): Promise<void> {
    await this.broadcastMessage.publish<SendEmailProps>('core.shared', {
      type: CoreBroadcastEnum.SEND_EMAIL,
      message: {
        subject: input.title,
        to: user.email,
        content: input.content,
        lang: user.defaultLang,
      },
      meta: {
        userId: user.id,
      },
    })
  }

  async perform(input: NotificationProps): Promise<void> {
    const user = await CoreUserModel.findOrFail(input.userId)

    await user.load('notifications')

    const notifyViaPlatform = await user.notifications.find(
      (n) => n.notificationKey === input.notificationType
    )

    if (!notifyViaPlatform) {
      return
    }

    for (const { type } of notifyViaPlatform.platforms) {
      const contract = this.contract[type]

      if (contract) {
        await contract(input, user)
      }
    }
  }
}
