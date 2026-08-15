import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/controller'
export class AuthMeApiController implements Controller<HttpContext> {
  async perform(ctx: HttpContext) {
    const { user } = ctx.auth
    return ctx.response.ok({ user })
  }
}
