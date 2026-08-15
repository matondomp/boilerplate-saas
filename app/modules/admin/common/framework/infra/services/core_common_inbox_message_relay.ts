import app from '@adonisjs/core/services/app'
import bull from '@acidiney/bull-queue/services/main'
import { CoreCommonInboxMessagesJob } from '../jobs/core_common_inbox_messages_job.js'

await app.booted(async () => {
  bull.dispatch(
    CoreCommonInboxMessagesJob.name,
    {},
    {
      queueName: CoreCommonInboxMessagesJob.name,
      repeat: {
        immediately: true,
        every: 1_000,
      },
    }
  )
})
