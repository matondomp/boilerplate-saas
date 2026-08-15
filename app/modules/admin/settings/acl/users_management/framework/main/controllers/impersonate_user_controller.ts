import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'

import { ImpersonateUserUseCase } from '../../../domain/index.js'
import { UniqueEntityID } from '#core/domain/index'
import vine from '@vinejs/vine'
import { CoreUserModel } from '#shared/framework/infra/index'

const schema = vine.object({
  username: vine.string().trim(),
})

const impersonateUserValidator = vine.compile(schema)

export class ImpersonateUserController implements Controller<HttpContext> {
  constructor(private readonly impersonateUserUseCase: ImpersonateUserUseCase.Contract) {}

  async perform({ request, session, auth, response }: HttpContext): Promise<any> {
    await auth.user!.load('role')

    const validation = await request.validateUsing(impersonateUserValidator)

    const output = await this.impersonateUserUseCase.perform({
      username: new UniqueEntityID(validation.username),
      role: new UniqueEntityID(auth.user!.role.slug),
    })

    if (output.isLeft()) {
      session.flash('alertGlobal', {
        success: false,
        message: output.value.errorMessage,
      })

      return response.redirect().back()
    }

    session.put('@impersonate:userId', {
      uid: auth.user!.id,
    })

    const user = await CoreUserModel.findOrFail(output.value.toString())

    await auth.use('web').login(user)

    session.regenerate()

    return response.redirect().back()
  }
}
