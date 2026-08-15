import { Controller, Operator } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { ListRolesUseCase } from '#modules/admin/settings/acl/roles_management/domain/usecases/list_roles/list_roles_usecase'
import { ListRolesUseCaseInput } from '#modules/admin/settings/acl/roles_management/domain/index'

export class ListRolesController implements Controller<HttpContext> {
  constructor(private readonly listRolesUseCase: ListRolesUseCase) {}

  async perform({ auth, inertia, request }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const orderBy = request.input('sort')
    const order = request.input('direction')

    const filters = {
      name: {
        operation: Operator.LIKE,
        value: request.input('name'),
      },
    }

    await auth.user?.load('role')

    const input: ListRolesUseCaseInput = {
      withPagination: true,
      page,
      perPage,
      isRoot: auth.user?.role.isRoot ?? false,
      filters: filters,
      orderBy: orderBy,
      orderByDirection: order,
    }

    const output = await this.listRolesUseCase.perform(input)
    console.log('output', output)
    return inertia.render<any>('view_roles/view_roles_page', {
      content: output,
      query: {
        page: input.page,
        perPage: input.perPage,
      },
    })
  }
}
