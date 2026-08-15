import { DateAdapter } from '#shared/domain/ports/index'
import { FindLogsRepository } from './ports/find_logs_repository.js'
import { ViewLogsUseCase } from '#modules/admin/audit/log/domain/index'
import { Pagination } from '#core/ports/index'
import { LogsQueryBuilder } from './ports/logs_query_builder.js'

export class ViewLogsUseCaseImpl implements ViewLogsUseCase.Contract {
  constructor(
    private readonly findLogsRepository: FindLogsRepository,
    private readonly logsQueryBuilder: LogsQueryBuilder,
    private readonly dateAdapater: DateAdapter
  ) {}

  async perform(input: ViewLogsUseCase.Input): Promise<Pagination<ViewLogsUseCase.Output>> {
    const logs = await this.findLogsRepository.find(input, this.logsQueryBuilder.build(input))

    return {
      pagination: logs.pagination,
      data: logs.data.map((log) => ({
        title: log.title,
        source: log.source,
        summary: log.summary,
        fullLog: log.fullLog,
        success: log.success,
        errorMessage: log.errorMessage,
        createdAtText: this.dateAdapater.format(new Date(log.createdAt)),
        createdAt: this.dateAdapater.toRelative(new Date(log.createdAt)),
        hash: log.hash!,
        username: log.username,
      })),
    }
  }
}
