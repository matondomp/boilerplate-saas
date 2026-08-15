import { LogsFiltersMountedQuery } from '#modules/admin/audit/log//usecases/view_logs/ports/logs_query_builder'
import { Options, FindLogsRepository } from '#modules/admin/audit/log/usecases/index'
import { CoreAppLogs } from '../models/core_app_logs.js'
import { Pagination } from '#core/ports/index'
import { LogEntity } from '#modules/admin/audit/log/domain/index'
import { LogMapper } from '#modules/admin/audit/log/framework/infra/db/mappers/log_mapper'
// import { DateTime } from 'luxon'

export class FindLogsRepositoryImpl implements FindLogsRepository {
  private readonly collection = CoreAppLogs

  constructor(private readonly logMapper: LogMapper = new LogMapper()) {}

  async find(
    options: Options,
    mountedQuery: LogsFiltersMountedQuery
  ): Promise<Pagination<LogEntity>> {
    const logs = await this.collection
      .find(mountedQuery.query)
      .sort('createdAt', 'desc')
      .skip(options.perPage * (options.page - 1))
      .limit(options.perPage)
      .toArray()

    const totalLogs = await this.collection.countDocuments(mountedQuery.query)

    return {
      pagination: {
        total: totalLogs,
        perPage: options.perPage,
        page: options.page,
      },
      data: logs.map(this.logMapper.toDomain),
    }
  }
}
