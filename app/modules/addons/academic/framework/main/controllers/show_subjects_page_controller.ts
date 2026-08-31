import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import {
  AcademicSubjectModel,
  AcademicCourseModel,
} from '../../infra/db/models/index.js'

export class ShowSubjectsPageController implements Controller<HttpContext> {
  async perform({ request, inertia }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const nameFilter = request.input('name', '')

    const query = AcademicSubjectModel.query()
      .whereNull('deleted_at')
      .preload('courses')

    if (nameFilter) {
      query.whereILike('name', `%${nameFilter}%`)
    }

    const subjects = await query.orderBy('created_at', 'desc').paginate(page, perPage)
    const courses = await AcademicCourseModel.query().whereNull('deleted_at').orderBy('name', 'asc')

    return inertia.render<any>('subjects/subjects_page', {
      content: {
        data: subjects.all().map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          courses: (s.courses || []).map((c) => ({ id: c.id, name: c.name })),
          createdAt: s.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
          updatedAt: s.updatedAt?.toFormat('dd/MM/yyyy HH:mm'),
        })),
        pagination: subjects.getMeta(),
      },
      courses: courses.map((c) => ({ id: c.id, name: c.name })),
    })
  }
}
