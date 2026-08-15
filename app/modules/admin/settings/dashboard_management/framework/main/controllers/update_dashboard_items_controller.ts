import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { UpdateDashboardItemsUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { UpdateDashboardItemsValidator } from '../validators/update_dashboard_items_validator.js'

export class UpdateDashboardItemsController implements Controller<HttpContext> {
  constructor(private readonly updateDashboardItemsUseCase: UpdateDashboardItemsUseCase) {}

  async perform({ request, auth, response, session, i18n }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validations = await request.validateUsing(UpdateDashboardItemsValidator).catch((e) => {
      session.flash('alert', {
        success: false,
        message: e.messages,
      })
    })

    if (!validations) {
      return response.redirect().back()
    }

    const { items } = validations
    await this.updateDashboardItemsUseCase.perform(items)

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.items.edit.sucess'),
    })

    return response.redirect().back()
  }
}
