import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { GetStudentProfileUseCase } from '../../../domain/usecases/get_student_profile_usecase.js'

export class GetStudentProfileController implements Controller<HttpContext> {
  constructor(private readonly getStudentProfileUseCase: GetStudentProfileUseCase) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { response, auth } = ctx
    const userId = auth.user!.id
    const output = await this.getStudentProfileUseCase.perform({ userId })

    if (output.isLeft()) {
      return response.badRequest({ message: 'Erro ao buscar perfil' })
    }

    return response.ok({ data: output.value })
  }
}
