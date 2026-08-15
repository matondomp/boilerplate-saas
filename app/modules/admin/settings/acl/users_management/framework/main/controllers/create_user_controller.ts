import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { CreateUserUseCase } from '#modules/admin/settings/acl/users_management/domain/index'
import { CreateUserValidator } from '#modules/admin/settings/acl/users_management/framework/main/validations/create_user_validator'

export class CreateUserController implements Controller<HttpContext> {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async perform({ session, request, response, i18n }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(CreateUserValidator)
    const { isModal } = request.all()

    const output = await this.createUserUseCase.perform({
      lastName: validation.lastName,
      firstName: validation.firstName,
      email: validation.email,
      role: validation.role,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        successWithModal: isModal,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      successWithModal: isModal,
      message: i18n.formatMessage('admin.acl.user.new'),
    })

    return response.redirect().back()
  }
}
