import { Controller } from '#core/ports/index'

import { HttpContext } from '@adonisjs/core/http'
import { FindNotificationsUseCase, RetrieveTimezones } from '#modules/admin/common/domain/index'

export class ShowSettingsPageController implements Controller<HttpContext> {
  constructor(
    private readonly findNotificationsUseCase: FindNotificationsUseCase,
    private readonly findTimezonesUseCase: RetrieveTimezones.Contract
  ) {}

  async perform({ auth, inertia, response }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const notifications = await this.findNotificationsUseCase.perform({
      userId: auth.user.id,
    })

    const timezones = await this.findTimezonesUseCase.perform()

    return inertia.render('common_settings/common_general_page', {
      ...notifications,
      timezones,
    })
  }
}
