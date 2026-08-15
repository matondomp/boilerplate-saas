import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'

import { DeleteUserUseCase } from '../../../domain/index.js'
import vine from '@vinejs/vine'

const schema = vine.object({
  username: vine.string().trim(),
  motivation: vine.string().trim().optional(),
})

const deleteUserValidator = vine.compile(schema)

export class DeleteUserController implements Controller<HttpContext> {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  async perform({ request, session, i18n, response }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(deleteUserValidator).catch((e) => {
      console.log(e.messages)
    })

    if (!validation) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage('admin.acl.users.delete.missing.params'),
      })

      return response.redirect().back()
    }

    const output = await this.deleteUserUseCase.perform({
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
      message: i18n.formatMessage('admin.acl.users.deleted'),
    })

    return response.redirect().back()
  }
}
