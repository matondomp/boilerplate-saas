import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreateCourseUseCase } from '../../../domain/index.js'
import { CreateCourseValidation } from '../validators/index.js'

export class CreateCourseController implements Controller<HttpContext> {
  constructor(private readonly createCourseUseCase: CreateCourseUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, session } = ctx

    const payload = await request.validateUsing(CreateCourseValidation)

    const output = await this.createCourseUseCase.perform({
      universityId: payload.universityId,
      academicUnitId: payload.academicUnitId,
      name: payload.name,
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
        message: i18n.formatMessage('academic.course.created_success'),
      })
      return response.redirect().back()
    }

    return response.created({
      success: true,
      message: i18n.formatMessage('academic.course.created_success'),
      data: output.value,
    })
  }
}
