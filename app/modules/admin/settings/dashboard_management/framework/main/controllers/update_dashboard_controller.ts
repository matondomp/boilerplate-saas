import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { UpdateDashboardValidator } from '../validators/update_dashboard_validator.js'
import { UpdateDashboardUseCase, UpdateDashboardUseCaseInput } from '../../../domain/index.js'

export class UpdateDashboardController implements Controller<HttpContext> {
  constructor(private readonly updateDashboardUseCase: UpdateDashboardUseCase) {}
  async perform({ auth, response, request, session, i18n, params }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validations = await request.validateUsing(UpdateDashboardValidator).catch((e) => {
      session.flash('alert', {
        //TO REFACTOR
        successWithModal: true,
        success: false,
        message: e.messages,
      })
    })

    if (!validations) {
      return response.redirect().back()
    }

    const input: UpdateDashboardUseCaseInput = {
      slug: params.slug,
      name: validations.name,
      description: validations.description,
    }

    const output = await this.updateDashboardUseCase.perform(input)

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.updated'),
    })

    return response.redirect().back()
  }
}
