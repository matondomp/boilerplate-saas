import { Controller } from '#core/ports/index'
import { CoreUserModel } from '#shared/framework/infra/index'
import { HttpContext } from '@adonisjs/core/http'

export class StopImpersonateUserController implements Controller<HttpContext> {
  async perform({ session, auth, response }: HttpContext): Promise<any> {
    if (!session.has('@impersonate:userId')) {
      session.flash('alertGlobal', {
        success: false,
        message: 'admin.acl.impersonate.cannot_stop_impersonate',
      })
    }

    const { uid } = session.pull('@impersonate:userId')

    const user = await CoreUserModel.findOrFail(uid)

    await auth.use('web').login(user)

    session.regenerate()

    session.flash('alertGlobal', {
      success: true,
      message: 'admin.acl.impersonate.you_are_not_impersonate_anymore',
    })
    return response.redirect().back()
  }
}
