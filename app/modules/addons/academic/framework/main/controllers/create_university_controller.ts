import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreateUniversityUseCase } from '../../../domain/index.js'
import { CreateUniversityValidation } from '../validators/index.js'

export class CreateUniversityController implements Controller<HttpContext> {
  constructor(private readonly createUniversityUseCase: CreateUniversityUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, session } = ctx

    const payload = await request.validateUsing(CreateUniversityValidation)

    const output = await this.createUniversityUseCase.perform({
      name: payload.name,
      acronym: payload.acronym,
    })

    if (output.isLeft()) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage(output.value.errorMessage),
        })
        return response.redirect().back()
      }
      return response.badRequest({
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
        error: output.value.errorName,
      })
    }

    if (request.header('x-inertia')) {
      session.flash('alert', {
        success: true,
        message: i18n.formatMessage('academic.university.created_success'),
      })
      return response.redirect().back()
    }

    return response.created({
      success: true,
      message: i18n.formatMessage('academic.university.created_success'),
      data: output.value,
    })
  }
}
