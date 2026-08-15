import app from '@adonisjs/core/services/app'
import bull from '@acidiney/bull-queue/services/main'

import { CoreOutboxProcessorJob } from '#shared/framework/infra/jobs/core_outbox_processor_job'

await app.ready(async () => {
  bull.dispatch(
    CoreOutboxProcessorJob.name,
    {},
    {
      queueName: CoreOutboxProcessorJob.name,
      repeat: {
        immediately: true,
        every: 1_000,
      },
    }
  )
})
