import { Controller, Operator } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { ListUsersUseCase } from '#modules/admin/settings/acl/users_management/domain/index'

export class ListUsersController implements Controller<HttpContext> {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  async perform({ inertia, request }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const sort = request.input('sort', 'updatedAt')
    const order = request.input('direction', 'desc')

    const fullName = request.input('fullName')

    const output = await this.listUsersUseCase.perform({
      page,
      perPage,
      withPagination: true,
      orderBy: sort,
      filters: {
        fullName: {
          operation: Operator.LIKE,
          value: fullName,
        },
        email: {
          operation: Operator.LIKE,
          value: request.input('email'),
        },
        role: {
          operation: Operator.EQ,
          value: request.input('role'),
        },
        status: {
          operation: Operator.EQ,
          value: request.input('status'),
        },
      },
      orderByDirection: order,
    })
    return inertia.render('view_users/view_users_page', {
      content: output,
    })
  }
}
