import app from '@adonisjs/core/services/app'
import { loadContext } from './utils/load_context.js'
import { resolve } from 'node:path'

const loadFiles = async (path: string, pattern: any) => {
  let extraJobs = {}

  const req = loadContext(path, true, pattern)

  for (const filename of req.keys()) {
    const jobModule = await import(filename)

    extraJobs = {
      ...extraJobs,
      ...jobModule.default,
    }
  }

  return extraJobs
}

const jobs: Record<string, Function> = {
  CoreOutboxProcessorJob: () => import('#shared/framework/infra/jobs/core_outbox_processor_job'),
  CoreSharedInboxProcessor: () =>
    import('#shared/framework/infra/jobs/core_shared_inbox_processor_job'),
  CoreCommonInboxMessagesJob: () =>
    import('#modules/admin/common/framework/infra/jobs/core_common_inbox_messages_job'),
  CoreSendEmailJob: () => import('#shared/framework/infra/jobs/core_send_email_job'),
  ...(await loadFiles(
    resolve(app.appRoot.pathname, 'app/modules'),
    /infra\/jobs\/expose\.(ts|js)$/
  )),
}

export { jobs }
