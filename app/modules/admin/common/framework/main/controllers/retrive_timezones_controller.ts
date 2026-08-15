import { Controller } from '#core/ports/controller'
import { HttpContext } from '@adonisjs/core/http'
import { RetrieveTimezones } from '#modules/admin/common/domain/index'

export class RetrieveTimezonesController implements Controller<HttpContext> {
  constructor(private readonly useCase: RetrieveTimezones.Contract) {}

  async perform({ response }: HttpContext) {
    // TODO: add some caching logic here

    const output = this.useCase.perform()

    return response.ok(output)
  }
}
