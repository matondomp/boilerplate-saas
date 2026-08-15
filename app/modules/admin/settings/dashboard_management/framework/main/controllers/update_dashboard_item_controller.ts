import { UpdateDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { UpdateDashboardItemUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { UpdateDashboardItemValidator } from '../validators/update_dashboard_item_validator.js'

export class UpdateDashboardItemController implements Controller<HttpContext> {
  constructor(private readonly updateDashboardItemUseCase: UpdateDashboardItemUseCase) {}

  async perform({ request, auth, response, session, i18n, params }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validations = await request.validateUsing(UpdateDashboardItemValidator).catch((e) => {
      session.flash('alert', {
        success: false,
        message: e.messages,
      })
    })

    if (!validations) {
      return response.redirect().back()
    }

    const input: UpdateDashboardItemUseCaseInput = {
      id: params.id,
      chartType: validations.chartType,
      sqlRaw: validations.sqlRaw,
      name: validations.name,
    }

    await this.updateDashboardItemUseCase.perform(input)

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.item.edit.sucess'),
    })

    return response.redirect().back()
  }
}
