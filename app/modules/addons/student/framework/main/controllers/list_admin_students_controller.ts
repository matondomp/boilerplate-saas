import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { ListAdminStudentsUseCaseImpl } from '../../../usecases/admin/list_admin_students_usecase_impl.js'

export class ListAdminStudentsController implements Controller<HttpContext> {
  constructor(private readonly listAdminStudentsUseCase: ListAdminStudentsUseCaseImpl) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response } = ctx
    const search = request.input('search')
    const status = request.input('status')
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 15)

    const output = await this.listAdminStudentsUseCase.perform({
      search,
      status,
      page: Number(page),
      perPage: Number(perPage),
    })

    return response.ok(output.value)
  }
}
