import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { ListRolesDropdownUseCase } from '#modules/admin/settings/acl/roles_management/domain/usecases/list_roles_dropdown/index'

export class ListRolesDropdownControllerController implements Controller<HttpContext> {
  constructor(private readonly listRolesDropdownUseCase: ListRolesDropdownUseCase) {}

  async perform({ auth, response }: HttpContext): Promise<any> {
    await auth.user?.load('role')
    const output = await this.listRolesDropdownUseCase.perform({
      isRoot: auth.user?.role.isRoot ?? false,
    })

    return response.ok(output)
  }
}
