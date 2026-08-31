import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreatePreparationGoalUseCase } from '../../../domain/index.js'
import { CreatePreparationGoalValidation } from '../validators/index.js'

export class CreatePreparationGoalController implements Controller<HttpContext> {
  constructor(private readonly createPreparationGoalUseCase: CreatePreparationGoalUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, i18n, auth } = ctx

    if (!auth.user) {
      return response.unauthorized({
        success: false,
        message: i18n.formatMessage('auth.unauthorized'),
      })
    }

    const payload = await request.validateUsing(CreatePreparationGoalValidation)

    const output = await this.createPreparationGoalUseCase.perform({
      studentId: auth.user.id,
      universityId: payload.universityId,
      courseId: payload.courseId,
      targetExamPeriod: payload.targetExamPeriod,
    })

    if (output.isLeft()) {
      return response.badRequest({
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
        error: output.value.errorName,
      })
    }

    return response.created({
      success: true,
      message: i18n.formatMessage('academic.goal.created_success'),
      data: output.value,
    })
  }
}
