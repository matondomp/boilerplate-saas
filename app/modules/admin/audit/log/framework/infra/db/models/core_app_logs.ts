import { CoreAlternativeDatabase } from '#shared/framework/infra/db/models/core_alternative_database'
import { LogInterface } from '#modules/admin/audit/log/domain/interfaces/index'

export interface CoreAppLogsSchema extends LogInterface {
  hash: string
  createdAt: Date
}

const CoreAppLogs = CoreAlternativeDatabase.collection<CoreAppLogsSchema>('CoreAppLogs')

export { CoreAppLogs }
