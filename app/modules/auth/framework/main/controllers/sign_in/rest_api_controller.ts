import { HttpContext } from '@adonisjs/core/http'
import { CoreUserModel } from '#modules/shared/framework/infra/index'

import { BaseSignInController } from './base_sign_in_controller.js'
import { Controller } from '#core/ports/controller'
export class SignInApiController extends BaseSignInController implements Controller<HttpContext> {
  async perform(ctx: HttpContext) {
    const result = await super.signIn(ctx)
    if (!result.success) {
      switch (result.error) {
        case 'E_USER_MISMATCH':
          return ctx.response.unauthorized({
            message: result.message,
          })
        case 'E_TOO_MANY_REQUESTS':
          return ctx.response.tooManyRequests({ message: result.message })
        default:
          return ctx.response.badRequest({ message: result.message })
      }
    }

    const token = await CoreUserModel.accessTokens.create(result.userModel!)
    const message = {
      message: ctx.i18n.formatMessage('auth.login.success'),
      token,
    }
    return ctx.response.ok(message)
  }
}
