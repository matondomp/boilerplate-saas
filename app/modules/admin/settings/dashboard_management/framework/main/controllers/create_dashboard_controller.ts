import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreateDashboardValidator } from '../validators/create_dashboard_validator.js'
import {
  CreateDashboardUseCase,
  CreateDashboardUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/index'

export class CreateDashboardController implements Controller<HttpContext> {
  constructor(private readonly createDashboardUseCase: CreateDashboardUseCase) {}

  async perform({ request, auth, response, session, i18n }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validations = await request.validateUsing(CreateDashboardValidator).catch((e) => {
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

    const input: CreateDashboardUseCaseInput = {
      name: validations.name,
      description: validations.description,
    }

    const output = await this.createDashboardUseCase.perform(input)

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: output.value.errorMessage,
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('dashboard_management.create.success'),
    })

    if (validations.redirect) {
      return response.redirect(`/admin/settings/dashboards/${output.value.slug}`)
    }
    return response.redirect().back()
  }
}
