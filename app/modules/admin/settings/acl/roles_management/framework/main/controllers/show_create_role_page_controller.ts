import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { FindPermissionsUseCase } from '#modules/admin/settings/acl/roles_management/domain/index'

export class ShowCreateRolePageController implements Controller<HttpContext> {
  constructor(private readonly findPermissionsUseCase: FindPermissionsUseCase) {}

  async perform({ auth, inertia }: HttpContext): Promise<any> {
    await auth.user?.load('role')

    const isRoot = auth.user?.role.isRoot ?? false

    const permissions = await this.findPermissionsUseCase.perform({
      isRoot,
    })

    return inertia.render<any>('create_edit_role/create_edit_role_page', {
      permissions,
    })
  }
}
