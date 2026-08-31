import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import {
  AcademicExamModel,
  AcademicCourseModel,
} from '../../infra/db/models/index.js'

export class ShowExamsPageController implements Controller<HttpContext> {
  async perform({ request, inertia }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const courseFilter = request.input('course', '')
    const yearFilter = request.input('year', '')

    const query = AcademicExamModel.query()
      .whereNull('deleted_at')
      .preload('course', (courseQuery) => {
        courseQuery.preload('university')
      })
      .preload('questions')

    if (yearFilter) {
      query.where('year', yearFilter)
    }

    if (courseFilter) {
      query.where('course_id', courseFilter)
    }

    const exams = await query.orderBy('year', 'desc').paginate(page, perPage)
    const courses = await AcademicCourseModel.query()
      .whereNull('deleted_at')
      .preload('university')
      .orderBy('name', 'asc')

    return inertia.render<any>('exams/exams_page', {
      content: {
        data: exams.all().map((e) => ({
          id: e.id,
          courseId: e.courseId,
          courseName: e.course?.name,
          universityName: e.course?.university?.name,
          year: e.year,
          period: e.period,
          sourceType: e.sourceType,
          status: e.status,
          questionsCount: e.questions ? e.questions.length : 0,
          documentUrl: e.documentUrl,
          createdAt: e.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
        })),
        pagination: exams.getMeta(),
      },
      courses: courses.map((c) => ({
        id: c.id,
        name: c.name,
        universityName: c.university?.name,
      })),
    })
  }
}
