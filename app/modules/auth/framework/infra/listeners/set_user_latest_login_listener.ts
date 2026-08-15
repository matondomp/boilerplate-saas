import Logger from '@adonisjs/core/services/logger'

import { UserLoggedEvent } from '#modules/auth/domain/events/user_logged_event'
import { FindUserIdRepository } from '#shared/usecases/ports/find_user_id_repository'
import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { Handler } from '#app/listeners/handler'
import { DateTime } from 'luxon'

export class SetUserLatestLoginListener extends Handler {
  constructor(private readonly findUserIdRepository: FindUserIdRepository) {
    super()
  }

  override async handle(event: UserLoggedEvent): Promise<void> {
    if (!event.eventData.success) return
    const user = await this.findUserIdRepository.findUserId(event.eventData.userId)

    if (!user) {
      Logger.error('User Logged "not found"!')
      return
    }

    Logger.info(`User "${user.fullName}" logged!`)

    user.userLogged(event.dateTimeOccurred)

    if (!user.lastLoginAt) {
      return
    }

    const userModel = await CoreUserModel.query().where('id', user.id.toString()).firstOrFail()
    userModel.lastLoginAt = DateTime.fromJSDate(user.lastLoginAt)
    await userModel.save()
  }
}
