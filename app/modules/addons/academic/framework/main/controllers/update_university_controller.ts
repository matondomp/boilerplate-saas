import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { UpdateUniversityUseCase } from '../../../domain/index.js'
import { UpdateUniversityValidation } from '../validators/index.js'

export class UpdateUniversityController implements Controller<HttpContext> {
  constructor(private readonly updateUniversityUseCase: UpdateUniversityUseCase) {}

  async perform({ params, request, response, session, i18n }: HttpContext): Promise<any> {
    const payload = await request.validateUsing(UpdateUniversityValidation)

    const output = await this.updateUniversityUseCase.perform({
      id: params.id,
      name: payload.name,
      acronym: payload.acronym,
      status: payload.status,
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
        message: 'Universidade atualizada com sucesso!',
      })
      return response.redirect().back()
    }

    return response.ok({
      success: true,
      message: 'Universidade atualizada com sucesso!',
    })
  }
}
