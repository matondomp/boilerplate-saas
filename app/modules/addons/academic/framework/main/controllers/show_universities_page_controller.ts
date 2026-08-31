import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { AcademicUniversityModel } from '../../infra/db/models/index.js'

export class ShowUniversitiesPageController implements Controller<HttpContext> {
  async perform({ request, inertia }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const nameFilter = request.input('name', '')
    const acronymFilter = request.input('acronym', '')

    const query = AcademicUniversityModel.query().whereNull('deleted_at')

    if (nameFilter) {
      query.whereILike('name', `%${nameFilter}%`)
    }

    if (acronymFilter) {
      query.whereILike('acronym', `%${acronymFilter}%`)
    }

    const universities = await query.orderBy('created_at', 'desc').paginate(page, perPage)

    return inertia.render<any>('universities/universities_page', {
      content: {
        data: universities.all().map((u) => ({
          id: u.id,
          name: u.name,
          acronym: u.acronym,
          status: u.status,
          createdAt: u.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
          updatedAt: u.updatedAt?.toFormat('dd/MM/yyyy HH:mm'),
        })),
        pagination: {
          total: universities.total,
          perPage: universities.perPage,
          page: universities.currentPage,
        },
      },
    })
  }
}
