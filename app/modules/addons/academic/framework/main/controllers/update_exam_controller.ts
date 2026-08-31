import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { AcademicExamModel } from '../../infra/db/models/index.js'
import vine from '@vinejs/vine'

export class UpdateExamController implements Controller<HttpContext> {
  async perform(ctx: HttpContext): Promise<any> {
    const { params, request, response, session, i18n } = ctx
    const exam = await AcademicExamModel.find(params.id)
    if (!exam) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage('academic.errors.exam_not_found'),
        })
        return response.redirect().back()
      }
      return response.notFound({ message: 'Exame não encontrado' })
    }

    const schema = vine.object({
      courseId: vine.string().uuid(),
      year: vine.number().min(1900).max(2100),
      period: vine.string().trim().minLength(2),
      sourceType: vine.string().trim().optional(),
    })

    const payload = await request.validateUsing(vine.compile(schema))

    exam.courseId = payload.courseId
    exam.year = payload.year
    exam.period = payload.period
    if (payload.sourceType) {
      exam.sourceType = payload.sourceType
    }

    await exam.save()

    if (request.header('x-inertia')) {
      session.flash('alert', {
        success: true,
        message: i18n.formatMessage('academic.exam.updated_success'),
      })
      return response.redirect().back()
    }

    return response.ok({
      success: true,
      message: i18n.formatMessage('academic.exam.updated_success'),
      data: {
        id: exam.id,
        courseId: exam.courseId,
        year: exam.year,
        period: exam.period,
      },
    })
  }
}
