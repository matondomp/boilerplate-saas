import { LogsQueryBuilderImpl } from '#modules/admin/audit/log/framework/infra/db/builder/logs_query_builder_impl'
import { ExtractLogsUseCaseImpl } from '#modules/admin/audit/log/usecases/extract_logs/extract_logs_usecase_impl'
import { ExtractLogsController } from '#modules/admin/audit/log/framework/main/controllers/extract_logs_controller'
import { DateAdapterImpl } from '#modules/shared/framework/infra/index'
import { DocumentGeneratorAdapterImpl } from '#modules/shared/framework/infra/adapters/document_generator_adapter_impl'
import { FindLogsToExtractRepositoryImpl } from '#modules/admin/audit/log/framework/infra/db/repositories/find_logs_to_extract_respository_impl'
import {
  AppSettingColorMapper,
  FindAppSettingRepositoryImpl,
} from '#modules/admin/settings/application_management/framework/index'

export const makeExtractLogsFactory = (): ExtractLogsController => {
  return new ExtractLogsController(
    new ExtractLogsUseCaseImpl(
      new LogsQueryBuilderImpl(),
      new FindLogsToExtractRepositoryImpl(),
      new FindAppSettingRepositoryImpl(new AppSettingColorMapper()),
      new DocumentGeneratorAdapterImpl(),
      new DateAdapterImpl()
    )
  )
}
