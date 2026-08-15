import { ViewLogsController } from '#modules/admin/audit/log/framework/main/controllers/index'
import { ViewLogsUseCaseImpl } from '#modules/admin/audit/log/usecases/index'
import { FindLogsRepositoryImpl } from '#modules/admin/audit/log/framework/infra/db/repositories/index'
import { DateAdapterImpl } from '#shared/framework/infra/index'
import { ViewLogsWebPresenter } from '../presenters/web/view_logs_web_presenter.js'
import { LogsQueryBuilderImpl } from '#modules/admin/audit/log/framework/infra/db/builder/logs_query_builder_impl'

export const makeViewLogsWebFactory = (): ViewLogsController => {
  return new ViewLogsController(
    new ViewLogsUseCaseImpl(
      new FindLogsRepositoryImpl(),
      new LogsQueryBuilderImpl(),
      new DateAdapterImpl()
    ),
    new ViewLogsWebPresenter()
  )
}
