import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'

import { RedefinePasswordUseCase } from '../../../domain/index.js'
import vine from '@vinejs/vine'

const schema = vine.object({
  username: vine.string().trim(),
})

const redefinePasswordValidator = vine.compile(schema)
export class RedefineUserPasswordController implements Controller<HttpContext> {
  constructor(private readonly redefineUserPasswordUseCase: RedefinePasswordUseCase) {}

  async perform({ request, i18n, response }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(redefinePasswordValidator)

    if (!validation) {
      return response.badRequest({
        message: i18n.formatMessage('admin.acl.users.redefine_password.missing.params'),
      })
    }

    const output = await this.redefineUserPasswordUseCase.perform({
      username: validation.username,
    })

    if (output.isLeft()) {
      return response.badRequest({
        message: i18n.formatMessage(output.value.errorMessage),
      })
    }

    return response.ok({
      newPassword: output.value,
    })
  }
}
