import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { UpdateUniversityUseCase } from '../../../domain/index.js'

export class ChangeUniversityStatusController implements Controller<HttpContext> {
  constructor(private readonly updateUniversityUseCase: UpdateUniversityUseCase) {}

  async perform({ params, request, response, session, i18n }: HttpContext): Promise<any> {
    const { status } = request.only(['status'])
    if (!status || (status !== 'ACTIVE' && status !== 'INACTIVE')) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: 'Status inválido',
        })
        return response.redirect().back()
      }
      return response.badRequest({ message: 'Status inválido' })
    }

    const output = await this.updateUniversityUseCase.perform({
      id: params.id,
      status: status,
    })

    if (output.isLeft()) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage(output.value.errorMessage),
        })
        return response.redirect().back()
      }
      return response.badRequest({
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
        error: output.value.errorName,
      })
    }

    if (request.header('x-inertia')) {
      session.flash('alert', {
        success: true,
        message: 'Status da universidade alterado com sucesso!',
      })
      return response.redirect().back()
    }

    return response.ok({
      success: true,
      message: 'Status da universidade alterado com sucesso!',
      status: status,
    })
  }
}
