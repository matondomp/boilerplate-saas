import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import {
  DetachDashboardItemUseCase,
  DetachDashboardItemUseCaseInput,
} from '../../../domain/index.js'

export class DetachDashboardItemController implements Controller<HttpContext> {
  constructor(private readonly detachDashboardItemUseCase: DetachDashboardItemUseCase) {}

  async perform({ auth, response, session, params, i18n }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const input: DetachDashboardItemUseCaseInput = {
      dashboardItemId: params.dashboardItemId,
      dashboardSlug: params.dashboardSlug,
    }

    const output = await this.detachDashboardItemUseCase.perform(input)

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.items.detach.success'),
    })

    return response.redirect().back()
  }
}
