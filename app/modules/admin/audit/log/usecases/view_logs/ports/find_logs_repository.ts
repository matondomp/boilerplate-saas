import { Paginate, Pagination, Search } from '#core/ports/index'
import { LogEntity } from '#modules/admin/audit/log/domain/index'
import { LogsFiltersMountedQuery } from './logs_query_builder.js'

export interface Options extends Paginate, Search {}
export interface FindLogsRepository {
  find(input: Options, mountedQuery: LogsFiltersMountedQuery): Promise<Pagination<LogEntity>>
}
