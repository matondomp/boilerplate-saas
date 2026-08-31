import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { AcademicSubjectModel, AcademicCourseSubjectModel } from '../../infra/db/models/index.js'
import { randomUUID } from 'node:crypto'

export class UpdateSubjectController implements Controller<HttpContext> {
  async perform(ctx: HttpContext): Promise<any> {
    const { params, request, response, session, i18n } = ctx

    const subject = await AcademicSubjectModel.find(params.id)
    if (!subject) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage('academic.errors.subject_not_found'),
        })
        return response.redirect().back()
      }
      return response.notFound({ message: 'Disciplina não encontrada' })
    }

    const { name, description, courseIds } = request.only(['name', 'description', 'courseIds'])
    if (name) subject.name = name
    if (description !== undefined) subject.description = description

    await subject.save()

    if (Array.isArray(courseIds)) {
      await AcademicCourseSubjectModel.query().where('subject_id', subject.id).delete()
      for (const courseId of courseIds) {
        await AcademicCourseSubjectModel.create({
          id: randomUUID(),
          subjectId: subject.id,
          courseId,
        })
      }
    }

    if (request.header('x-inertia')) {
      session.flash('alert', {
        success: true,
        message: i18n.formatMessage('academic.subject.updated_success'),
      })
      return response.redirect().back()
    }

    return response.ok({
      message: 'Disciplina atualizada com sucesso!',
      subject: {
        id: subject.id,
        name: subject.name,
        description: subject.description,
      },
    })
  }
}
