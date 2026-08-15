import { UpdateDefaultDashboardUseCase } from '#modules/admin/settings/dashboard_management/domain/index'
import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'

export class UpdateDefaultDashboardController implements Controller<HttpContext> {
  constructor(private readonly updateDefaultDashboardUseCase: UpdateDefaultDashboardUseCase) {}
  async perform({ auth, response, session, i18n, params }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const output = await this.updateDefaultDashboardUseCase.perform({
      dashboardSlug: params.dashboardSlug,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.default.updated'),
    })

    return response.redirect().back()
  }
}
