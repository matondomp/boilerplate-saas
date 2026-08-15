import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { RetrieveNewestNotificationsUseCase } from '#modules/admin/common/domain/index'

export class RetrieveNewestNotificationsController implements Controller<HttpContext> {
  constructor(
    private readonly retrieveNewestNotificationUseCase: RetrieveNewestNotificationsUseCase
  ) {}

  async perform({ auth, i18n, response }: HttpContext): Promise<any> {
    const userId = auth.user?.id

    if (!userId) {
      return response.unauthorized({
        error: i18n.formatMessage('shared.unauthorized'),
      })
    }

    const output = await this.retrieveNewestNotificationUseCase.perform({
      userId,
      orderDirection: 'desc',
      hideOpenedNotifications: true,
      perPage: 6,
      page: 1,
      withPagination: false,
    })

    return response.ok(output)
  }
}
