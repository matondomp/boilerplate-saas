import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { UpdateStudentStatusUseCaseImpl } from '../../../usecases/admin/update_student_status_usecase_impl.js'

export class UpdateStudentStatusController implements Controller<HttpContext> {
  constructor(private readonly updateStatusUseCase: UpdateStudentStatusUseCaseImpl) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { params, request, response, session } = ctx
    const status = request.input('status') as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

    const output = await this.updateStatusUseCase.perform({
      studentId: params.id,
      status,
    })

    const isRestApi = request.header('accept')?.includes('json') && !request.header('x-inertia')

    if (output.isLeft()) {
      if (isRestApi) {
        return response.badRequest({ message: 'Aluno não encontrado ou erro ao alterar estado' })
      }
      session.flash('errors', { student: 'Aluno não encontrado ou erro ao alterar estado' })
      return response.redirect().back()
    }

    if (isRestApi) {
      return response.ok({ message: 'Status do aluno atualizado com sucesso' })
    }

    session.flash('success', 'Status do aluno atualizado com sucesso')
    return response.redirect().back()
  }
}
