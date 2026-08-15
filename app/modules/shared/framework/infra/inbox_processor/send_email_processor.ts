import CoreSendEmailJob, { SendEmailProps } from './../jobs/core_send_email_job.js'
import { InboxProcessorContract } from '#shared/domain/ports/index'
import bull from '@acidiney/bull-queue/services/main'

export class SendEmailProcessor implements InboxProcessorContract<SendEmailProps> {
  async perform(input: SendEmailProps): Promise<'QUEUED'> {
    bull.dispatch(CoreSendEmailJob.name, { ...input })

    return 'QUEUED'
  }
}
