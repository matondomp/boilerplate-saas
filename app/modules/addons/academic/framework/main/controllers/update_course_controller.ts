import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { AcademicCourseModel } from '../../infra/db/models/index.js'

export class UpdateCourseController implements Controller<HttpContext> {
  async perform(ctx: HttpContext): Promise<any> {
    const { params, request, response, session, i18n } = ctx

    const course = await AcademicCourseModel.find(params.id)
    if (!course) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage('academic.errors.course_not_found'),
        })
        return response.redirect().back()
      }
      return response.notFound({ message: 'Curso não encontrado' })
    }

    const { name, universityId, academicUnitId, status } = request.only([
      'name',
      'universityId',
      'academicUnitId',
      'status',
    ])

    if (name) course.name = name
    if (universityId) course.universityId = universityId
    if (academicUnitId !== undefined) course.academicUnitId = academicUnitId || null
    if (status) course.status = status

    await course.save()

    if (request.header('x-inertia')) {
      session.flash('alert', {
        success: true,
        message: i18n.formatMessage('academic.course.updated_success'),
      })
      return response.redirect().back()
    }

    return response.ok({
      message: 'Curso atualizado com sucesso!',
      course: {
        id: course.id,
        name: course.name,
        universityId: course.universityId,
        academicUnitId: course.academicUnitId,
        status: course.status,
      },
    })
  }
}
