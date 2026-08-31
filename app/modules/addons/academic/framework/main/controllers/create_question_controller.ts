import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreateQuestionUseCase } from '../../../domain/index.js'
import { CreateQuestionValidation } from '../validators/index.js'

export class CreateQuestionController implements Controller<HttpContext> {
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, session } = ctx

    const payload = await request.validateUsing(CreateQuestionValidation)

    const output = await this.createQuestionUseCase.perform({
      examId: payload.examId,
      subjectId: payload.subjectId,
      topicId: payload.topicId,
      type: payload.type as any,
      statement: payload.statement,
      difficulty: payload.difficulty as any,
      solution: payload.solution,
      explanation: payload.explanation,
      source: payload.source as any,
      sourceMetadata: payload.sourceMetadata,
      options: payload.options,
    })

    if (output.isLeft()) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage(output.value.errorMessage),
        })
        return response.redirect().toPath('/academic/questions')
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
        message: i18n.formatMessage('academic.question.created_success'),
      })
      return response.redirect().toPath('/academic/questions')
    }

    return response.created({
      success: true,
      message: i18n.formatMessage('academic.question.created_success'),
      data: output.value,
    })
  }
}
