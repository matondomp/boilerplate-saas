import { CaptureException } from '#app/exceptions/capture_exception'
import { Job, JobHandlerContract } from '@acidiney/bull-queue/types'

export class CoreCommonInboxMessagesJob implements JobHandlerContract<null> {
  async failed(job: Job): Promise<void> {
    await CaptureException.capture(job.failedReason, job)
  }

  async handle(): Promise<void> {
    // Todo: need to implement a strategy to do processing and after that notify both
    //  commonInboxMessage and broker that was delivered
  }
}

export default CoreCommonInboxMessagesJob
