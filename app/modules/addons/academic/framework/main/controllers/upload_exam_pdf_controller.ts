import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { AcademicExamModel } from '../../infra/db/models/index.js'
import { prepareStorage } from '#start/utils/prepare_local_storage'
import { join } from 'node:path'

export class UploadExamPdfController implements Controller<HttpContext> {
  async perform(ctx: HttpContext): Promise<any> {
    const { request, params, response, session, i18n } = ctx
    const examId = params.id
    const exam = await AcademicExamModel.find(examId)

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

    const pdfFile = request.file('document', {
      size: '20mb',
      extnames: ['pdf'],
    })

    if (!pdfFile) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: 'Nenhum arquivo PDF foi enviado',
        })
        return response.redirect().back()
      }
      return response.badRequest({ message: 'Nenhum arquivo PDF foi enviado' })
    }

    if (!pdfFile.isValid) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: 'Arquivo PDF inválido',
        })
        return response.redirect().back()
      }
      return response.badRequest({ errors: pdfFile.errors })
    }

    const fileName = `${exam.id}_${Date.now()}.pdf`
    const storagePath = join(prepareStorage(false), 'exams')

    await pdfFile.move(storagePath, {
      name: fileName,
      overwrite: true,
    })

    exam.documentUrl = `/uploads/exams/${fileName}`
    exam.status = 'READY'
    await exam.save()

    if (request.header('x-inertia')) {
      session.flash('alert', {
        success: true,
        message: i18n.formatMessage('academic.exam.uploaded_success'),
      })
      return response.redirect().back()
    }

    return response.ok({
      message: 'Arquivo PDF carregado com sucesso!',
      documentUrl: exam.documentUrl,
    })
  }
}
