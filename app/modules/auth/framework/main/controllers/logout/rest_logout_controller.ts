import { HttpContext } from '@adonisjs/core/http'
import { UniqueEntityID } from '#core/domain/unique_entity_id'
import { Controller } from '#core/ports/controller'
import { IEventDispatcher } from '#core/domain/index'
import { UserLogoutEvent } from '#modules/auth/domain/events/user_logout_event'
import { CoreUserModel } from '#modules/shared/framework/infra/index'

export class LogoutApiController implements Controller<HttpContext> {
  constructor(private readonly eventDispatcher: IEventDispatcher) {}

  async perform({ auth, i18n, response }: HttpContext) {
    const userId = auth.user!.id
    await CoreUserModel.accessTokens.delete(
      auth.user!,
      (auth.user! as any).currentAccessToken.identifier
    )
    void this.eventDispatcher.publish(
      new UserLogoutEvent({
        userId: new UniqueEntityID(userId),
      })
    )
    const message = i18n.formatMessage('auth.logout.success')
    return response.ok({ message })
  }
}
