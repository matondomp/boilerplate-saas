import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'

import { UpdateRoleUseCase } from '../../../domain/index.js'
import { UpdateRoleValidation } from '../validations/update_role_validation.js'

export class UpdateRoleController implements Controller<HttpContext> {
  constructor(private readonly updateRoleUseCase: UpdateRoleUseCase) {}

  async perform({ auth, session, i18n, request, response }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(UpdateRoleValidation)

    const userId = auth.user?.id

    await auth.user?.load('role')

    if (!userId) {
      return response.redirect().back()
    }
    const output = await this.updateRoleUseCase.perform({
      isRoot: auth.user?.role.isRoot ?? false,
      roleSlug: validation.roleSlug,
      name: validation.name,
      description: validation.description,
      permissions: validation.permissions,
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
      message: i18n.formatMessage('admin.acl.roles.updated'),
    })

    return response.redirect('/account/admin/settings/acl/roles')
  }
}
