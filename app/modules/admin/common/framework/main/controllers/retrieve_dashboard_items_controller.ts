import { RetrieveDashboardItemsUseCase } from '#modules/admin/common/domain/usecases/retrieve_dashboard_items/retrieve_dashboard_items_usecase'
import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'

export class RetrieveDashboardItemsController implements Controller<HttpContext> {
  constructor(private readonly retrieveDashboardItemsUseCase: RetrieveDashboardItemsUseCase) {}

  async perform({ auth, response, params }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const output = await this.retrieveDashboardItemsUseCase.perform({
      dashboardSlug: params.dashboardSlug,
    })

    if (output.isLeft()) {
      return response.badRequest(output.value)
    }
    return response.ok(output.value)
  }
}
