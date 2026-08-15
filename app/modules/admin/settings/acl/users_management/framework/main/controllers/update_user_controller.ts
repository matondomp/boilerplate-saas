import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { UpdateUserUseCase } from '../../../domain/index.js'
import { CreateUserValidator } from '../validations/create_user_validator.js'

export class UpdateUserController implements Controller<HttpContext> {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async perform({ params, request, response, session, i18n }: HttpContext): Promise<any> {
    const { username } = params
    const validation = await request.validateUsing(CreateUserValidator).catch(() => {})

    if (!validation) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage('shared.missing.params'),
        successWithModal: true,
      })

      return response.redirect().back()
    }

    const output = await this.updateUserUseCase.perform({
      username,
      ...validation,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
        successWithModal: true,
      })

      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('admin.acl.users.user_updated'),
    })

    return response.redirect().back()
  }
}
