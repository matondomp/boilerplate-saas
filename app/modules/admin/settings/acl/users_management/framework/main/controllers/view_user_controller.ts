import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { FindUserUseCase } from '../../../domain/index.js'

export class ViewUserController implements Controller<HttpContext> {
  constructor(private readonly findUserUseCase: FindUserUseCase) {}

  async perform({ params, i18n, session, response, inertia }: HttpContext): Promise<any> {
    const { username } = params

    const output = await this.findUserUseCase.perform({ username })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })

      return response.redirect('/account/admin/settings/acl/users')
    }

    return inertia.render('admin/common/framework/views/common_profile', {
      data: output.value,
    })
  }
}
