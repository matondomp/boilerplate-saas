import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { UpdateStudentProfileUseCaseImpl } from '../../../usecases/manage_student_profile/update_student_profile_usecase_impl.js'

export class UpdateStudentProfileController implements Controller<HttpContext> {
  constructor(private readonly updateProfileUseCase: UpdateStudentProfileUseCaseImpl) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response, session, auth } = ctx
    const userId = auth.user!.id
    const body = request.only(['fullName', 'phone', 'avatarUrl', 'preferredLanguage', 'birthYear'])
    const birthYear = body.birthYear ? Number(body.birthYear) : undefined
    const isJson = request.header('accept')?.includes('json') || request.header('content-type')?.includes('json')

    const output = await this.updateProfileUseCase.perform({
      userId,
      fullName: body.fullName,
      phone: body.phone,
      avatarUrl: body.avatarUrl,
      preferredLanguage: body.preferredLanguage,
      birthYear,
    })

    if (output.isLeft()) {
      if (isJson) {
        return response.badRequest({ message: 'Erro ao atualizar perfil' })
      }
      session.flash('errors', { profile: 'Erro ao atualizar perfil' })
      return response.redirect().back()
    }

    if (isJson) {
      return response.ok({ message: 'Perfil atualizado com sucesso' })
    }

    session.flash('success', 'Perfil atualizado com sucesso')
    return response.redirect().back()
  }
}
