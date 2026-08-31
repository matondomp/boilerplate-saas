import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { SetPrimaryPreparationGoalUseCase } from '../../../domain/usecases/set_primary_preparation_goal_usecase.js'
import { SetPrimaryPreparationGoalValidation } from '../validators/index.js'

export class SetPrimaryPreparationGoalController implements Controller<HttpContext> {
  constructor(private readonly setPrimaryPreparationGoalUseCase: SetPrimaryPreparationGoalUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, session, auth } = ctx
    const payload = await request.validateUsing(SetPrimaryPreparationGoalValidation)
    const userId = auth.user!.id
    const isJson = request.header('accept')?.includes('json') || request.header('content-type')?.includes('json')

    const output = await this.setPrimaryPreparationGoalUseCase.perform({
      userId,
      goalId: payload.goalId,
    })

    if (output.isLeft()) {
      if (isJson) {
        return response.badRequest({ message: 'Erro ao definir objetivo principal' })
      }
      session.flash('errors', { goal: 'Erro ao definir objetivo principal' })
      return response.redirect().back()
    }

    if (isJson) {
      return response.ok({ message: 'Objetivo principal atualizado com sucesso' })
    }

    session.flash('success', 'Objetivo principal atualizado com sucesso')
    return response.redirect().back()
  }
}
