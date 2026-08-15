import { HttpContext } from '@adonisjs/core/http'
import { UniqueEntityID } from '#core/domain/unique_entity_id'
import { Controller } from '#core/ports/controller'
import { IEventDispatcher } from '#core/domain/index'
import { UserLogoutEvent } from '#modules/auth/domain/events/user_logout_event'

export class LogoutWebController implements Controller<HttpContext> {
  constructor(private readonly eventDispatcher: IEventDispatcher) {}

  async perform({ auth, session, i18n, response }: HttpContext) {
    const userId = auth.user!.id

    await auth.use('web').logout()

    session.flash('alertGlobal', {
      success: true,
      message: i18n.formatMessage('auth.logout.success'),
    })

    void this.eventDispatcher.publish(
      new UserLogoutEvent({
        userId: new UniqueEntityID(userId),
      })
    )

    return response.redirect('/security/auth/login')
  }
}
