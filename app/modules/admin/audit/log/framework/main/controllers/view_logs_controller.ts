import { ViewLogsUseCase } from '#modules/admin/audit/log/domain/index'
import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { ViewLogsPresenter } from '../presenters/ports/view_logs_presenter.js'
import { ViewLogsFiltersValidator } from '../validators/view_logs_filters_validator.js'

export class ViewLogsController implements Controller<HttpContext> {
  constructor(
    private readonly viewLogsUseCase: ViewLogsUseCase.Contract,
    private readonly viewLogsPresenter: ViewLogsPresenter.Contract
  ) {}

  async perform({ request, inertia, response }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const validation = await request.validateUsing(ViewLogsFiltersValidator, request.all()).catch()

    const output = await this.viewLogsUseCase.perform({
      withPagination: true,
      page: Number.parseInt(page),
      perPage: Number.parseInt(perPage),
      date: request.qs().date,
      ...validation,
    })

    return this.viewLogsPresenter.perform({
      httpContext: { inertia, response },
      useCaseOutput: output,
    })
  }
}
