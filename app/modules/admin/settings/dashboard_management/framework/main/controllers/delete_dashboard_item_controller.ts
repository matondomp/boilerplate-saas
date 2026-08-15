import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { DeleteDashboardItemUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/index'

export class DeleteDashboardItemController implements Controller<HttpContext> {
  constructor(private readonly deleteDashboardItemUseCase: DeleteDashboardItemUseCase) {}

  async perform({ auth, response, session, params, i18n }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const output = await this.deleteDashboardItemUseCase.perform(params.id)

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.items.delete.success'),
    })

    return response.redirect().back()
  }
}
