import { ListDashboardsUseCase } from '#modules/admin/settings/dashboard_management/domain/index'
import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'

export class ListDashboardsController implements Controller<HttpContext> {
  constructor(private readonly listDashboardsUseCase: ListDashboardsUseCase) {}
  async perform({ auth, response, inertia }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }
    const output = await this.listDashboardsUseCase.perform()
    return inertia.render<any>('dashboard_management/dashboard_management_page', {
      data: output,
    })
  }
}
