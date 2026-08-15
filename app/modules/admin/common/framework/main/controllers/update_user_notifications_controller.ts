import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { UpdateUserNotificationsUseCase } from '#modules/admin/common/domain/index'

import { UpdateUserNotificationsValidator } from '#modules/admin/common/framework/main/validators/update_user_notifications_validator'

export class UpdateUserNotificationsController implements Controller<HttpContext> {
  constructor(private readonly updateUserNotificationsUseCase: UpdateUserNotificationsUseCase) {}

  async perform({ auth, request, response, session }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validation = await request.validateUsing(UpdateUserNotificationsValidator)

    if (!validation) {
      return response.redirect().back()
    }

    const output = await this.updateUserNotificationsUseCase.perform({
      userId: auth.user.id,
      platform: validation.platform as string[],
      email: validation.email as string[],
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: output.value.errorMessage,
      })

      return
    }

    session.flash('alert', {
      success: true,
      message: 'common.user.notification.updated',
    })

    return response.redirect().back()
  }
}
