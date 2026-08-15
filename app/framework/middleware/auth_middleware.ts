import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

import { StatusEnum } from '#shared/domain/types/index'
import { CoreUserModel } from '#modules/shared/framework/infra/index'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/security/auth/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    for (let guard of options.guards || ['web']) {
      const rewriteGuard = guard === 'apiWeb' ? 'web' : guard

      try {
        await ctx.auth.authenticateUsing([rewriteGuard])

        if (ctx.auth.user!.statusId !== StatusEnum.ACTIVE || ctx.auth.user!.deletedAt) {
          if (guard === 'api') {
            await CoreUserModel.accessTokens.delete(
              ctx.auth.user!,
              (ctx.auth.user! as any).currentAccessToken.identifier
            )
          } else {
            await ctx.auth.use(guard).logout()
          }

          switch (guard) {
            case 'web':
              ctx.session.flash('alertGlobal', {
                success: false,
                message: ctx.i18n.formatMessage('auth.login_revoked'),
              })

              return ctx.response.redirect(this.redirectTo)
            case 'apiWeb':
            case 'api':
              return ctx.response.unauthorized({
                message: ctx.i18n.formatMessage('auth.login_revoked'),
              })
          }
        }

        return next()
      } catch (e) {
        if (e.name === 'E_UNAUTHORIZED_ACCESS') {
          switch (guard) {
            case 'web':
              ctx.session.flash('alertGlobal', {
                success: false,
                message: ctx.i18n.formatMessage('auth.unauthorized'),
              })

              return ctx.response.redirect(this.redirectTo)
            case 'apiWeb':
            case 'api':
              return ctx.response.unauthorized({
                message: ctx.i18n.formatMessage('auth.unauthorized'),
              })
          }
        }
        return ctx.response.redirect(this.redirectTo)
      }
    }
  }
}
