import { ExtractLogsUseCase } from '#modules/admin/audit/log/domain/index'
import { LogsQueryBuilder } from '../view_logs/ports/logs_query_builder.js'
import { resolve } from 'node:path'
import { getCurrentDir } from '#start/utils/current_dir'
import { DateAdapter } from '#modules/shared/domain/ports/index'
import { DocumentGeneratorAdapter } from '#modules/shared/domain/ports/document_generator_adapter'
import { FindLogsToExtractRepository } from './ports/find_logs_repository.js'
import { FindAppSettingsRepository } from './ports/find_app_settings_repository.js'
export class ExtractLogsUseCaseImpl implements ExtractLogsUseCase.Contract {
  constructor(
    private logsQueryBuilder: LogsQueryBuilder,
    private findLogsToExtractRepository: FindLogsToExtractRepository,
    private findAppSettingsRepository: FindAppSettingsRepository,
    private documentGeneratorAdapter: DocumentGeneratorAdapter,
    private readonly dateAdapater: DateAdapter
  ) {}

  async perform(input: ExtractLogsUseCase.Input): Promise<Buffer | string> {
    const logs = await this.findLogsToExtractRepository.find(this.logsQueryBuilder.build(input))
    const appSettings = await this.findAppSettingsRepository.findAppSetting()

    const document = await this.documentGeneratorAdapter.generate({
      data: {
        application: appSettings.appName,
        date: this.dateAdapater.format(new Date()),
        logs: logs.map((log) => ({
          source: log.source,
          summary: input.localeTranslations[log.summary],
          success: log.success,
          createdAtText: this.dateAdapater.format(new Date(log.createdAt)),
          username: log.username,
        })),
      },
      format: input.fileFormat,
      docTemplatePath: resolve(
        getCurrentDir(import.meta.url),
        '../../framework/infra/resources/logs-template.ods'
      ),
    })
    return document
  }
}
