import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { ChangeQuestionStatusUseCase } from '../../../domain/index.js'
import { ChangeQuestionStatusValidation } from '../validators/index.js'

export class ChangeQuestionStatusController implements Controller<HttpContext> {
  constructor(private readonly changeQuestionStatusUseCase: ChangeQuestionStatusUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, auth, params, session } = ctx

    if (!auth.user) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage('auth.unauthorized'),
        })
        return response.redirect().back()
      }
      return response.unauthorized({
        success: false,
        message: i18n.formatMessage('auth.unauthorized'),
      })
    }

    const payload = await request.validateUsing(ChangeQuestionStatusValidation)

    const output = await this.changeQuestionStatusUseCase.perform({
      id: params.id,
      newStatus: payload.status as any,
      authorId: auth.user.id,
      reason: payload.reason,
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
        message: i18n.formatMessage('academic.question.status_changed_success'),
      })
      return response.redirect().back()
    }

    return response.ok({
      success: true,
      message: i18n.formatMessage('academic.question.status_changed_success'),
    })
  }
}
