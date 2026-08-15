import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import {
  AttachDashboardItemUseCase,
  AttachDashboardItemUseCaseInput,
} from '../../../domain/index.js'
import { AttachDashboardItemValidator } from '../validators/attach_dashboard_item_validator.js'

export class AttachDashboardItemController implements Controller<HttpContext> {
  constructor(private readonly attachDashboardItemUseCase: AttachDashboardItemUseCase) {}

  async perform({ auth, response, request, session, params, i18n }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validations = await request.validateUsing(AttachDashboardItemValidator).catch((e) => {
      session.flash('alert', {
        success: false,
        message: e.messages,
      })
    })

    if (!validations) {
      return response.redirect().back()
    }

    const input: AttachDashboardItemUseCaseInput = {
      dashboardItemId: params.itemId,
      dashboardSlug: params.dashboardSlug,
      width: validations.width,
      height: validations.height,
      x: validations.x,
      y: validations.y,
    }

    const output = await this.attachDashboardItemUseCase.perform(input)

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.items.attach.success'),
    })

    return response.redirect().back()
  }
}
