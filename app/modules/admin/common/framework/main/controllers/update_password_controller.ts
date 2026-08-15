import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'

import { UpdatePasswordUseCase } from '#modules/admin/common/domain/index'
import { UpdatePasswordValidator } from '../validators/update_password_validator.js'

export class UpdatePasswordController implements Controller<HttpContext> {
  constructor(private readonly updatePasswordUseCase: UpdatePasswordUseCase) {}

  async perform({ auth, session, request, response }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validations = await request.validateUsing(UpdatePasswordValidator)

    if (!validations) {
      return response.redirect().back()
    }

    const output = await this.updatePasswordUseCase.perform({
      userId: auth.user.id,
      passwordOptions: {
        currentPassword: validations.currentPassword,
        newPassword: validations.newPassword,
        confirmPassword: validations.confirmPassword,
      },
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: output.value.errorMessage,
      })

      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: 'common.user.password_updated',
    })

    return response.redirect().back()
  }
}
