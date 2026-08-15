import { HttpContext } from '@adonisjs/core/http'
import { ExtractLogsUseCase } from '#modules/admin/audit/log/domain/index'
import { ExtractLogsValidator } from '../validators/extract_logs_validator.js'
import { Controller } from '#core/ports/controller'

export class ExtractLogsController implements Controller<HttpContext> {
  constructor(private readonly extractLogsUseCase: ExtractLogsUseCase.Contract) {}

  async perform({ request, response, i18n }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(ExtractLogsValidator, request.all()).catch()

    if (!validation) {
      return response.badRequest()
    }

    const output = await this.extractLogsUseCase.perform({
      ...validation,
      date: request.qs().date,
      localeTranslations: i18n.localeTranslations,
    })

    return response.ok(output)
  }
}
