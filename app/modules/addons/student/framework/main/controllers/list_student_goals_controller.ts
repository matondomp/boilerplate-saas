import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { ListStudentGoalsUseCase } from '../../../domain/usecases/list_student_goals_usecase.js'

export class ListStudentGoalsController implements Controller<HttpContext> {
  constructor(private readonly listStudentGoalsUseCase: ListStudentGoalsUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { response, auth } = ctx
    const userId = auth.user!.id
    const output = await this.listStudentGoalsUseCase.perform({ userId })

    if (output.isLeft()) {
      return response.badRequest({ message: 'Erro ao buscar objetivos' })
    }

    return response.ok({ data: output.value })
  }
}
