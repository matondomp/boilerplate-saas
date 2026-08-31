import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { ResumePreparationGoalUseCaseImpl } from '../../../usecases/manage_goal_lifecycle/resume_preparation_goal_usecase_impl.js'

export class ResumePreparationGoalController implements Controller<HttpContext> {
  constructor(private readonly resumeUseCase: ResumePreparationGoalUseCaseImpl) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { params, request, response, session, auth } = ctx
    const userId = auth.user!.id
    const isJson = request.header('accept')?.includes('json') || request.header('content-type')?.includes('json')
    const output = await this.resumeUseCase.perform({ userId, goalId: params.id })

    if (output.isLeft()) {
      if (isJson) {
        return response.badRequest({ message: 'Erro ao retomar objetivo' })
      }
      session.flash('errors', { goal: 'Erro ao retomar objetivo' })
      return response.redirect().back()
    }

    if (isJson) {
      return response.ok({ message: 'Objetivo retomado com sucesso' })
    }

    session.flash('success', 'Objetivo retomado com sucesso')
    return response.redirect().back()
  }
}
