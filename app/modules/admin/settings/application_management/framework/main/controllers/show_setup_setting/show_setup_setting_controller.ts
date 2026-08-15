import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { FindAppSettingUseCase } from '../../../../domain/usecases/find_app_setting/find_app_setting_usecase.js'

export class ShowAppSettingPageController implements Controller<HttpContext> {
  constructor(private readonly findAppSettingUseCase: FindAppSettingUseCase) {}
  async perform({ auth, inertia, response }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const appSetting = await this.findAppSettingUseCase.perform()

    return inertia.render('setup_application/setup_application_page', {
      ...appSetting,
    })
  }
}
