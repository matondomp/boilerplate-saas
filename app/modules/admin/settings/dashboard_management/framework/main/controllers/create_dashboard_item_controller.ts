import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import {
  CreateDashboardItemUseCase,
  CreateDashboardItemUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/index'
import { CreateDashboardItemValidator } from '#modules/admin/settings/dashboard_management/framework/main/validators/create_dashboard_item_validator'

export class CreateDashboardItemController implements Controller<HttpContext> {
  constructor(private readonly createDashboardItemUseCase: CreateDashboardItemUseCase) {}

  async perform({ request, auth, response, session }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validations = await request.validateUsing(CreateDashboardItemValidator).catch((e) => {
      session.flash('alert', {
        success: false,
        message: e.messages,
      })
    })

    if (!validations) {
      return response.redirect().back()
    }

    const input: CreateDashboardItemUseCaseInput = {
      name: validations.name,
      chartType: validations.chartType,
      dashboardId: validations.dashboardId,
      sqlRaw: validations.sqlRaw,
      x: validations.x,
      y: validations.y,
      width: validations.width,
      height: validations.height,
    }

    await this.createDashboardItemUseCase.perform(input)
    return response.redirect().back()
  }
}
