import app from '@adonisjs/core/services/app'
import bull from '@acidiney/bull-queue/services/main'

import { CoreSharedInboxProcessor } from '#shared/framework/infra/jobs/core_shared_inbox_processor_job'

await app.ready(async () => {
  bull.dispatch(
    CoreSharedInboxProcessor.name,
    {},
    {
      queueName: CoreSharedInboxProcessor.name,
      repeat: {
        immediately: true,
        every: 1_000,
      },
    }
  )
})
