import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { RetrieveNewestActivitiesUseCase } from '#modules/admin/common/domain/index'

export class RetrieveUserActivitiesController implements Controller<HttpContext> {
  constructor(private readonly retrieveUserActivitiesUseCase: RetrieveNewestActivitiesUseCase) {}

  async perform({ params, response }: HttpContext): Promise<any> {
    const output = await this.retrieveUserActivitiesUseCase.perform({
      userId: params.userId,
    })

    if (output.isLeft()) {
      return response.badRequest(output.value)
    }

    return response.ok(output.value)
  }
}
