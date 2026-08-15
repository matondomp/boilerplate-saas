import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { RetrieveDashboardsUseCase } from '#modules/admin/common/domain/usecases/retrieve_dashboards/retrieve_dashboards_usecase'

export class ViewDashboardsPageController implements Controller<HttpContext> {
  constructor(private readonly retrieveDashboardsUseCase: RetrieveDashboardsUseCase) {}

  async perform({ auth, response, inertia }: HttpContext) {
    if (!auth.user) {
      return response.redirect().back()
    }

    const output = await this.retrieveDashboardsUseCase.perform()

    return inertia.render('common_dashboard/common_dashboard_page', { dashboards: output })
  }
}
