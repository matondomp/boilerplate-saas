import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'

import { UnblockUserUseCase } from '../../../domain/index.js'
import { BlockUnblockValidator } from '../validations/block_unblock_validator.js'

export class UnblockUserController implements Controller<HttpContext> {
  constructor(private readonly unblockUserUseCase: UnblockUserUseCase) {}

  async perform({ request, session, i18n, response }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(BlockUnblockValidator).catch(() => {})

    if (!validation) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage('admin.acl.users.block_unblock.missing.params'),
      })

      return response.redirect().back()
    }

    const output = await this.unblockUserUseCase.perform({
      username: validation.username,
      motivation: validation.motivation,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })

      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('admin.acl.users.unblocked'),
    })

    return response.redirect().back()
  }
}
