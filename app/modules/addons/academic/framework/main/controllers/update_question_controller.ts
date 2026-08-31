import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { UpdateQuestionUseCase } from '../../../domain/index.js'
import { UpdateQuestionValidation } from '../validators/index.js'

export class UpdateQuestionController implements Controller<HttpContext> {
  constructor(private readonly updateQuestionUseCase: UpdateQuestionUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, auth, params, session } = ctx

    if (!auth.user) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage('auth.unauthorized'),
        })
        return response.redirect().toPath('/academic/questions')
      }
      return response.unauthorized({
        success: false,
        message: i18n.formatMessage('auth.unauthorized'),
      })
    }

    const payload = await request.validateUsing(UpdateQuestionValidation)

    const output = await this.updateQuestionUseCase.perform({
      id: params.id,
      statement: payload.statement,
      difficulty: payload.difficulty as any,
      solution: payload.solution,
      explanation: payload.explanation,
      topicId: payload.topicId,
      options: payload.options,
      version: payload.version,
      authorId: auth.user.id,
      reason: payload.reason,
    })

    if (output.isLeft()) {
      const isLockError = output.value.errorName === 'QuestionOptimisticLockConflictError'
      const errCode = isLockError ? 409 : 400
      
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage(output.value.errorMessage),
        })
        return response.redirect().toPath('/academic/questions')
      }

      if (isLockError) {
        return response.conflict({
          success: false,
          message: i18n.formatMessage(output.value.errorMessage),
          error: output.value.errorName,
        })
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
        message: i18n.formatMessage('academic.question.updated_success'),
      })
      return response.redirect().toPath('/academic/questions')
    }

    return response.ok({
      success: true,
      message: i18n.formatMessage('academic.question.updated_success'),
    })
  }
}
