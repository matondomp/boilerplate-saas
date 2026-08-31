import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { AcademicCourseModel } from '../../infra/db/models/index.js'

export class ChangeCourseStatusController implements Controller<HttpContext> {
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

    const { status } = request.only(['status'])
    if (status && (status === 'ACTIVE' || status === 'INACTIVE')) {
      course.status = status
      await course.save()
    }

    if (request.header('x-inertia')) {
      session.flash('alert', {
        success: true,
        message: i18n.formatMessage('academic.course.status_changed_success'),
      })
      return response.redirect().back()
    }

    return response.ok({
      message: 'Status do curso alterado com sucesso!',
      status: course.status,
    })
  }
}
