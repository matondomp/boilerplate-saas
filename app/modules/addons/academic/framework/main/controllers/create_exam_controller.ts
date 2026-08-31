import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreateExamUseCase } from '../../../domain/index.js'
import { CreateExamValidation } from '../validators/index.js'

export class CreateExamController implements Controller<HttpContext> {
  constructor(private readonly createExamUseCase: CreateExamUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, session } = ctx

    const payload = await request.validateUsing(CreateExamValidation)

    const output = await this.createExamUseCase.perform({
      courseId: payload.courseId,
      year: payload.year,
      period: payload.period,
      sourceType: payload.sourceType as any,
      sourceMetadata: payload.sourceMetadata,
      documentUrl: payload.documentUrl,
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
        message: i18n.formatMessage('academic.exam.created_success'),
      })
      return response.redirect().back()
    }

    return response.created({
      success: true,
      message: i18n.formatMessage('academic.exam.created_success'),
      data: output.value,
    })
  }
}
