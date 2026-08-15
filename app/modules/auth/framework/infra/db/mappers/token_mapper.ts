import * as luxon from 'luxon'
import { TokenEntity } from '#modules/auth/domain/index'
import { Mapper, UniqueEntityID } from '#core/domain/index'
import { TokenModel } from '#modules/auth/framework/infra/db/models/token_model'

export class TokenMapper implements Mapper<TokenEntity, TokenModel> {
  toDomain(tokenModel: TokenModel): TokenEntity {
    return TokenEntity.hydrate(new UniqueEntityID(tokenModel.id), {
      token: tokenModel.hash,
      userId: new UniqueEntityID(tokenModel.tokenableId),
      revoked: tokenModel.isRevoked,
      expiredAt: tokenModel.expiresAt.toJSDate(),
      tokenType: tokenModel.type,
    })
  }

  async toPersistence(tokenEntity: TokenEntity): Promise<TokenModel> {
    const tokenModel = await TokenModel.findOrFail(tokenEntity.id.toString())

    tokenModel.type = tokenEntity.tokenType
    tokenModel.hash = tokenEntity.token
    tokenModel.expiresAt = luxon.DateTime.fromJSDate(tokenEntity.expiredAt)
    tokenModel.isRevoked = tokenEntity.isRevoked

    return tokenModel
  }
}
