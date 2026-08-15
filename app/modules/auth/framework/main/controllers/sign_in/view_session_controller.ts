import { HttpContext } from '@adonisjs/core/http'
import { BaseSignInController } from './base_sign_in_controller.js'
import { Controller } from '#core/ports/controller'
export class SignInViewController extends BaseSignInController implements Controller<HttpContext> {
  async perform(ctx: HttpContext) {
    const result = await super.signIn(ctx)

    if (!result.success) {
      ctx.session.flashAll()
      ctx.session.flash('alertGlobal', {
        success: false,
        message: result.message,
      })
      return ctx.response.redirect().back()
    }
    await ctx.auth.use('web').login(result.userModel!, !!result.rememberMe)
    return ctx.response.redirect('/account/dashboard')
  }
}
