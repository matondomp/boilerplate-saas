import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { StudentRepositoriesImpl } from '../../infra/db/repositories/index.js'
import { ListAdminStudentsUseCaseImpl } from '../../../usecases/admin/list_admin_students_usecase_impl.js'

export class ShowAdminStudentsPageController implements Controller<HttpContext> {
  async perform(ctx: HttpContext): Promise<any> {
    const { request, inertia } = ctx
    const search = request.input('search', '')
    const fullName = request.input('fullName', '')
    const phone = request.input('phone', '')
    const status = request.input('status', '')
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const repo = new StudentRepositoriesImpl()
    const useCase = new ListAdminStudentsUseCaseImpl(repo)
    const output = await useCase.perform({
      search,
      fullName,
      phone,
      status,
      page: Number(page),
      perPage: Number(perPage),
    })

    if (!output.isRight()) {
      return inertia.render<any>('admin/admin_students_list_page', {
        content: {
          data: [],
          pagination: { total: 0, perPage: 10, page: 1 },
        },
      })
    }

    const result = output.value

    return inertia.render<any>('admin/admin_students_list_page', {
      content: {
        data: result.data,
        pagination: {
          total: result.meta.total,
          perPage: result.meta.perPage,
          page: result.meta.page,
        },
      },
    })
  }
}
