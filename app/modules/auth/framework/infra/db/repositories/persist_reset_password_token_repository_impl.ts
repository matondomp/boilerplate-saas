import * as luxon from 'luxon'
import { UniqueEntityID } from '#core/domain/index'
import { PersistResetPasswordTokenRepository } from '#modules/auth/usecases/index'

import { TokenModel } from '../models/token_model.js'
import { TokenTypes } from '#modules/auth/domain/index'
import env from '#start/env'

export class PersistResetPasswordTokenRepositoryImpl
  implements PersistResetPasswordTokenRepository
{
  async persist(userId: UniqueEntityID, hash: string): Promise<void> {
    await TokenModel.create({
      tokenableId: userId.toString(),
      hash,
      type: TokenTypes.RECOVER_PASSWORD,
      abilities: 'recover:password',
      expiresAt: luxon.DateTime.fromJSDate(new Date()).plus({
        hour: env.get('RESET_PASSWORD_EXPIRES_AT_PLUS_HOUR', 24) as number,
      }),
    })
  }
}
