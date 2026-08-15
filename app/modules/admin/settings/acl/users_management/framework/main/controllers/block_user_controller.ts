import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'

import { BlockUserUseCase } from '../../../domain/index.js'
import { BlockUnblockValidator } from '../validations/block_unblock_validator.js'

export class BlockUserController implements Controller<HttpContext> {
  constructor(private readonly blockUserUseCase: BlockUserUseCase) {}

  async perform({ request, session, i18n, response }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(BlockUnblockValidator).catch((e) => {
      console.log(e.messages)
    })

    if (!validation) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage('admin.acl.users.block_unblock.missing.params'),
      })

      return response.redirect().back()
    }

    const output = await this.blockUserUseCase.perform({
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
      message: i18n.formatMessage('admin.acl.users.blocked'),
    })

    return response.redirect().back()
  }
}
