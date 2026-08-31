import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import {
  AcademicCourseModel,
  AcademicUniversityModel,
  AcademicUnitModel,
} from '../../infra/db/models/index.js'

export class ShowCoursesPageController implements Controller<HttpContext> {
  async perform({ request, inertia }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const nameFilter = request.input('name', '')
    const universityIdFilter = request.input('universityId', '')
    const academicUnitIdFilter = request.input('academicUnitId', '')

    const query = AcademicCourseModel.query()
      .whereNull('deleted_at')
      .preload('university')
      .preload('academicUnit')

    if (nameFilter) {
      query.whereILike('name', `%${nameFilter}%`)
    }

    if (universityIdFilter) {
      query.where('university_id', universityIdFilter)
    }

    if (academicUnitIdFilter) {
      query.where('academic_unit_id', academicUnitIdFilter)
    }

    const courses = await query.orderBy('created_at', 'desc').paginate(page, perPage)
    const universities = await AcademicUniversityModel.query().whereNull('deleted_at').orderBy('name', 'asc')
    const academicUnits = await AcademicUnitModel.query().whereNull('deleted_at').orderBy('name', 'asc')

    return inertia.render<any>('courses/courses_page', {
      content: {
        data: courses.all().map((c) => ({
          id: c.id,
          name: c.name,
          universityId: c.universityId,
          universityName: c.university?.name,
          academicUnitId: c.academicUnitId,
          academicUnitName: c.academicUnit?.name,
          status: c.status,
          createdAt: c.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
          updatedAt: c.updatedAt?.toFormat('dd/MM/yyyy HH:mm'),
        })),
        pagination: courses.getMeta(),
      },
      universities: universities.map((u) => ({ id: u.id, name: `${u.name} (${u.acronym})` })),
      academicUnits: academicUnits.map((u) => ({ id: u.id, name: u.name, universityId: u.universityId })),
    })
  }
}
