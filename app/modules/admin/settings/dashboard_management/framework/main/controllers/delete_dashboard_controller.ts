import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { DeleteDashboardUseCase } from '../../../domain/usecases/delete_dashboard/delete_dashboard_usecase.js'

export class DeleteDashboardController implements Controller<HttpContext> {
  constructor(private readonly deleteDashboardUseCase: DeleteDashboardUseCase) {}

  async perform({ auth, response, session, params, i18n }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const output = await this.deleteDashboardUseCase.perform(params.slug)

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.delete.success'),
    })

    return response.redirect().back()
  }
}
