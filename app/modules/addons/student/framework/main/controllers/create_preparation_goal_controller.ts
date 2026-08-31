import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { CreatePreparationGoalUseCase } from '../../../domain/usecases/create_preparation_goal_usecase.js'
import { CreatePreparationGoalValidation } from '../validators/index.js'

export class CreatePreparationGoalController implements Controller<HttpContext> {
  constructor(private readonly createPreparationGoalUseCase: CreatePreparationGoalUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, session, auth } = ctx
    const payload = await request.validateUsing(CreatePreparationGoalValidation)
    const userId = auth.user!.id
    const isJson = request.header('accept')?.includes('json') || request.header('content-type')?.includes('json')

    const output = await this.createPreparationGoalUseCase.perform({
      userId,
      universityId: payload.universityId,
      courseId: payload.courseId,
      targetYear: payload.targetYear,
      targetExamId: payload.targetExamId,
      targetExamPeriod: payload.targetExamPeriod,
      isPrimary: payload.isPrimary,
    })

    if (output.isLeft()) {
      const error = output.value
      const errorMessage = (error as any)?.error?.message || (error as any)?.message || 'Erro ao criar objetivo'
      if (isJson) {
        return response.badRequest({ message: errorMessage })
      }
      session.flash('errors', { goal: errorMessage })
      return response.redirect().back()
    }

    if (isJson) {
      return response.created(output.value)
    }

    session.flash('success', 'Objetivo de preparação criado com sucesso')
    return response.redirect().back()
  }
}
