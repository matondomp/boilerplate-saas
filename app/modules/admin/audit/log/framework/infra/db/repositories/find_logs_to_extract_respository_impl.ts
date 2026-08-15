import { LogEntity } from '#modules/admin/audit/log/domain/index'
import { CoreAppLogs } from '#modules/admin/audit/log/framework/infra/db/models/core_app_logs'
import { FindLogsToExtractRepository } from '#modules/admin/audit/log/usecases/extract_logs/ports/find_logs_repository'
import { LogsFiltersMountedQuery } from '#modules/admin/audit/log/usecases/view_logs/ports/logs_query_builder'
import { LogMapper } from '../mappers/log_mapper.js'

export class FindLogsToExtractRepositoryImpl implements FindLogsToExtractRepository {
  private readonly collection = CoreAppLogs

  constructor(private readonly logMapper: LogMapper = new LogMapper()) {}

  async find(mountedQuery: LogsFiltersMountedQuery): Promise<LogEntity[]> {
    const logs = await this.collection.find(mountedQuery.query).sort('createdAt', 'desc').toArray()
    return logs.map(this.logMapper.toDomain)
  }
}
