import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CanMiddleware {
  async handle({ auth, session, i18n, response }: HttpContext, next: NextFn, options: string) {
    await auth.authenticate()

    if (!auth.isAuthenticated) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage('shared.unauthorized'),
      })

      return response.redirect().back()
    }

    await auth.user!.load('role', (builder) => {
      builder.preload('permissions')
    })

    const userPermissions = auth.user!.role.permissions

    const hasAllPrivileges = userPermissions.find((uP) => uP.id === options)

    if (!hasAllPrivileges) {
      session.flash('alertGlobal', {
        success: false,
        message: i18n.formatMessage('shared.missing.permissions'),
      })

      return response.redirect().back()
    }

    /**
     * Call next method in the pipeline and return its output
     */

    await next()
  }
}
