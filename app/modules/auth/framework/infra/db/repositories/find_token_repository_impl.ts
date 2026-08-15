import { TokenEntity } from '#modules/auth/domain/index'
import { TokenModel } from '#modules/auth/framework/infra/db/models/token_model'
import { FindTokenRepository } from '#shared/usecases/ports/find_token_repository'
import { TokenMapper } from '#modules/auth/framework/infra/db/mappers/token_mapper'

export class FindTokenRepositoryImpl implements FindTokenRepository {
  constructor(readonly tokenMapper: TokenMapper) {}

  async find(token: string): Promise<TokenEntity | undefined> {
    const tokenModel = await TokenModel.findBy('hash', token)

    if (!tokenModel) {
      return
    }

    return this.tokenMapper.toDomain(tokenModel)
  }
}
