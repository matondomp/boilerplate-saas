import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { PausePreparationGoalUseCaseImpl } from '../../../usecases/manage_goal_lifecycle/pause_preparation_goal_usecase_impl.js'

export class PausePreparationGoalController implements Controller<HttpContext> {
  constructor(private readonly pauseUseCase: PausePreparationGoalUseCaseImpl) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { params, request, response, session, auth } = ctx
    const userId = auth.user!.id
    const isJson = request.header('accept')?.includes('json') || request.header('content-type')?.includes('json')
    const output = await this.pauseUseCase.perform({ userId, goalId: params.id })

    if (output.isLeft()) {
      if (isJson) {
        return response.badRequest({ message: 'Erro ao pausar objetivo' })
      }
      session.flash('errors', { goal: 'Erro ao pausar objetivo' })
      return response.redirect().back()
    }

    if (isJson) {
      return response.ok({ message: 'Objetivo pausado com sucesso' })
    }

    session.flash('success', 'Objetivo pausado com sucesso')
    return response.redirect().back()
  }
}
