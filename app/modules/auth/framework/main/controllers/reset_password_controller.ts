import { Controller } from '#core/ports/controller'
import { HttpContext } from '@adonisjs/core/http'
import { ResetPasswordUseCase } from '#modules/auth/domain/usecases/reset_password_use_case'

import { resetPasswordValidator } from '#modules/auth/framework/main/validators/reset_password_validator'

export class ResetPasswordController implements Controller<HttpContext> {
  constructor(readonly resetPasswordUseCase: ResetPasswordUseCase.Contract) {}

  async perform({ session, request, response, i18n }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(resetPasswordValidator, {
      messagesProvider: resetPasswordValidator.messagesProvider,
    })

    const output = await this.resetPasswordUseCase.perform({
      token: validation.token,
      password: validation.password,
      confirmPassword: validation.password,
    })

    if (output.isLeft()) {
      session.flash('alertGlobal', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })

      return response.redirect().back()
    }

    session.flash('alertGlobal', {
      success: true,
      message: i18n.formatMessage('auth.reset_password.success'),
    })

    return response.redirect('/security/auth/login')
  }
}
