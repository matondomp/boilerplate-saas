import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreateSubjectUseCase } from '../../../domain/index.js'
import { CreateSubjectValidation } from '../validators/index.js'

export class CreateSubjectController implements Controller<HttpContext> {
  constructor(private readonly createSubjectUseCase: CreateSubjectUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, session } = ctx

    const payload = await request.validateUsing(CreateSubjectValidation)

    const output = await this.createSubjectUseCase.perform({
      name: payload.name,
      description: payload.description,
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
        message: i18n.formatMessage('academic.subject.created_success'),
      })
      return response.redirect().back()
    }

    return response.created({
      success: true,
      message: i18n.formatMessage('academic.subject.created_success'),
      data: output.value,
    })
  }
}
