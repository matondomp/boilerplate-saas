import { ListDashboardItemsUseCase } from '#modules/admin/settings/dashboard_management/domain/index'
import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'

export class ListDashboardItemsController implements Controller<HttpContext> {
  constructor(private readonly listDashboardItemsUseCase: ListDashboardItemsUseCase) {}
  async perform({ auth, response }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }
    const output = await this.listDashboardItemsUseCase.perform()
    return response.ok(output)
  }
}
