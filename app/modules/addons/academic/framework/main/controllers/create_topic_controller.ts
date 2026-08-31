import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreateTopicUseCase } from '../../../domain/index.js'
import { CreateTopicValidation } from '../validators/index.js'

export class CreateTopicController implements Controller<HttpContext> {
  constructor(private readonly createTopicUseCase: CreateTopicUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, session } = ctx

    const payload = await request.validateUsing(CreateTopicValidation)

    const output = await this.createTopicUseCase.perform({
      subjectId: payload.subjectId,
      parentId: payload.parentId,
      name: payload.name,
      position: payload.position,
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
        message: i18n.formatMessage('academic.topic.created_success'),
      })
      return response.redirect().back()
    }

    return response.created({
      success: true,
      message: i18n.formatMessage('academic.topic.created_success'),
      data: output.value,
    })
  }
}
