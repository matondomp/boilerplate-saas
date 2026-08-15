import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { ListDashboardDetailsUseCase } from '#modules/admin/settings/dashboard_management/domain/usecases/index'

export class ListDashboardDetailsController implements Controller<HttpContext> {
  constructor(private readonly listDashboardDetailsUseCase: ListDashboardDetailsUseCase) {}

  async perform({ auth, response, params, inertia, session, i18n }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const output = await this.listDashboardDetailsUseCase.perform({ slug: params.slug })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    return inertia.render<any>('dashboard_detail/dashboard_details_page', {
      data: output.value,
    })
  }
}
