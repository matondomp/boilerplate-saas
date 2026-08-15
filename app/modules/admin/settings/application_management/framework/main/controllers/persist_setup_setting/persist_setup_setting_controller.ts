import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { PersistAppSettindValidator } from '../../validators/persist_app_setting_validator.js'
import { PersistAppSettingUseCase } from '../../../../domain/usecases/persist_app_setting/persist_app_setting_usecase.js'
import { UploadService } from '#modules/shared/framework/main/ports/upload_service'
import env from '#start/env'

export class PersistAppSettingController implements Controller<HttpContext> {
  constructor(
    private readonly persistAppSettingUseCase: PersistAppSettingUseCase,
    private readonly uploadService: UploadService
  ) {}
  async perform({ auth, session, request, i18n, response }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validations = await request.validateUsing(PersistAppSettindValidator).catch(() => {})

    if (!validations) {
      session.flash('alert', {
        sucess: false,
        message: i18n.formatMessage('admin.settings.app.error'),
      })
      return response.redirect().back()
    }

    const logo = request.file('logo', {
      size: '2mb',
      extnames: ['jpg', 'png'],
    })

    let logoUrl: string | undefined

    if (logo) {
      logoUrl = await this.uploadService.upload(
        logo,
        env.get('APP_NAME', 'orion'),
        `logo.${logo.extname}`,
        true
      )
    }

    const output = await this.persistAppSettingUseCase.perform({
      appName: validations.appName,
      appDesc: validations.appDesc,
      imageUrl: logoUrl,
      appColorPrimary: validations.appColorPrimary,
      appColorSecondary: validations.appColorSecondary,
      appBackgroundPrimaryColor: validations.appBackgroundPrimaryColor,
      appBackgroundSecondaryColor: validations.appBackgroundSecondaryColor,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })

      return response.redirect().back()
    }

    session.forget('header')

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('admin.settings.app.sucess'),
    })

    return response.redirect().back()
  }
}
