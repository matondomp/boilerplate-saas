import env from '#start/env'
import { Job, JobHandlerContract } from '@acidiney/bull-queue/types'
import encryption from '@adonisjs/core/services/encryption'
import mail from '@adonisjs/mail/services/main'
import { CoreInboxMessagesModel } from '../db/models/core_inbox_messages_model.js'
import { StatusEnum } from '#shared/domain/types/status_type'
import { CaptureException } from '#app/exceptions/capture_exception'
import { CoreOutboxMessageModel } from '../index.js'

export interface SendEmailProps {
  to: string
  subject: string
  cc?: string
  bcc?: string
  attach?: string
  content: string
  lang: string
  inboxId?: string
}

export default class CoreSendEmailJob implements JobHandlerContract<SendEmailProps> {
  async failed(job: Job<SendEmailProps, any, string>): Promise<void> {
    const { data } = job

    const inbox = await CoreInboxMessagesModel.findByOrFail('id', data.inboxId)

    inbox.status = StatusEnum.FAILED
    inbox.complete = true

    await inbox.save()

    await CaptureException.capture(job.failedReason, job)
  }

  async handle(job: Job<SendEmailProps>) {
    const { data } = job

    const appName = env.get('APP_NAME')

    const { to, cc, bcc, content, subject, attach } = data

    await mail.send((message) => {
      message
        .from(env.get('MAIL_FROM') as string)
        .to(to)
        .subject(`${appName} - ${subject}`)
        .header('x-sign-token', encryption.encrypt(appName))

      if (bcc) {
        message.bcc(bcc)
      }

      if (cc) {
        message.cc(cc)
      }

      if (attach) {
        message.attach(attach)
      }

      message.html(content)
    })

    console.log('Email sent')

    if (data.inboxId) {
      const inbox = await CoreInboxMessagesModel.findByOrFail('id', data.inboxId)

      await CoreOutboxMessageModel.query()
        .where({
          id: inbox.metaOutboxId,
        })
        .delete()

      await inbox.delete()
    }
  }
}
