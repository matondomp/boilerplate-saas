import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import {
  FindPermissionsUseCase,
  FindRoleUseCase,
} from '#modules/admin/settings/acl/roles_management/domain/index'

export class ShowEditRolePageController implements Controller<HttpContext> {
  constructor(
    private readonly findPermissionsUseCase: FindPermissionsUseCase,
    private readonly findRoleUseCase: FindRoleUseCase
  ) {}

  async perform({ auth, params, session, i18n, response, inertia }: HttpContext): Promise<any> {
    await auth.user?.load('role')

    const { roleSlug } = params
    const isRoot = auth.user?.role.isRoot ?? false

    const permissions = await this.findPermissionsUseCase.perform({
      isRoot,
    })

    const roleOrError = await this.findRoleUseCase.perform({
      roleSlug,
      isRoot,
    })

    if (roleOrError.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(roleOrError.value.errorMessage),
      })

      return response.redirect().back()
    }

    return inertia.render<any>('create_edit_role/create_edit_role_page', {
      role: roleOrError.value,
      permissions,
    })
  }
}
