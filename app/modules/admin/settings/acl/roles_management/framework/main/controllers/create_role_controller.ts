import { HttpContext } from '@adonisjs/core/http'

import { Controller } from '#core/ports/index'
import { CreateRoleUseCase } from '#modules/admin/settings/acl/roles_management/domain/index'
import { CreateRoleValidation } from '../validations/create_role_validation.js'

export class CreateRoleController implements Controller<HttpContext> {
  constructor(private readonly createRoleUseCase: CreateRoleUseCase) {}

  async perform({ session, request, response, i18n, auth }: HttpContext): Promise<any> {
    if (!auth.user) {
      session.flash('alertGlobal', {
        success: false,
        message: i18n.formatMessage('auth.unauthorized'),
      })
      return response.redirect().back()
    }

    const validation = await request.validateUsing(CreateRoleValidation).catch((e) => {
      session.flash('alert', {
        success: false,
        message: e.message,
      })
    })

    if (!validation) {
      return response.redirect().back()
    }
    const output = await this.createRoleUseCase.perform({
      name: validation.name,
      description: validation.description,
      permissions: validation.permissions,
      userId: auth.user.id,
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
      message: i18n.formatMessage('admin.acl.role.role_created'),
    })

    if (validation.redirect) {
      return response.redirect('/account/admin/settings/acl/roles')
    }

    return response.redirect().back()
  }
}
