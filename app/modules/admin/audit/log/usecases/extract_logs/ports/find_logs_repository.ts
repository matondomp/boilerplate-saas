import { Search } from '#core/ports/index'
import { LogEntity } from '#modules/admin/audit/log/domain/index'
import { LogsFiltersMountedQuery } from '../../view_logs/ports/logs_query_builder.js'

export interface Options extends Search {}
export interface FindLogsToExtractRepository {
  find(queryBuilder: LogsFiltersMountedQuery): Promise<LogEntity[]>
}
