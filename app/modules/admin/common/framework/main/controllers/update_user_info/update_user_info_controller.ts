import { HttpContext } from '@adonisjs/core/http'

import { Controller } from '#core/ports/index'
import { UploadService } from './ports/index.js'
import { UpdateUserInfoUseCase } from '#modules/admin/common/domain/index'
import { UpdateUserInfoValidator } from '../../validators/update_user_info_validator.js'

export class UpdateUserInfoController implements Controller<HttpContext> {
  constructor(
    private readonly uploadAvatarService: UploadService,
    private readonly updateUserInfoUseCase: UpdateUserInfoUseCase
  ) {}

  async perform({ auth, request, session, i18n, response }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().back()
    }

    const validation = await request.validateUsing(UpdateUserInfoValidator).catch((e) => {
      session.flash('alert', {
        success: false,
        message: e.messages,
      })
    })

    if (!validation) {
      return response.redirect().back()
    }

    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'png'],
    })

    const userId = auth.user.id

    let avatarUrl: string | undefined

    if (avatar) {
      avatarUrl = await this.uploadAvatarService.upload(
        avatar,
        auth.user.slug,
        `profile.${avatar.extname}`
      )
    }

    const output = await this.updateUserInfoUseCase.perform({
      userId,
      avatarUrl: avatarUrl,
      firstName: validation.firstName,
      lastName: validation.lastName,
      timezone: validation.timezone,
      defaultLang: validation.defaultLang,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('common.user.info.updated'),
    })

    return response.redirect().back()
  }
}
