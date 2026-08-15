import { ViewLogsUseCase } from '#modules/admin/audit/log/domain/index'
import { Pagination } from '#core/ports/pagination'
import { HttpContext } from '@adonisjs/core/http'

export namespace ViewLogsPresenter {
  export interface Input {
    httpContext: Pick<HttpContext, 'response' | 'inertia'>
    useCaseOutput: Pagination<ViewLogsUseCase.Output>
  }

  export type Contract = {
    perform(input: Input): any
  }
}
