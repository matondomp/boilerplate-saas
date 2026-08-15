import { TokenEntity } from '#modules/auth/domain/index'
import { TokenMapper } from '#modules/auth/framework/infra/db/mappers/token_mapper'
import { UpdateTokenRepository } from '#modules/auth/usecases/reset_password/ports/index'

export class UpdateTokenRepositoryImpl implements UpdateTokenRepository {
  constructor(private readonly tokenMapper: TokenMapper) {}

  async update(tokenEntity: TokenEntity): Promise<void> {
    const tokenModel = await this.tokenMapper.toPersistence(tokenEntity)

    await tokenModel.save()
  }
}
