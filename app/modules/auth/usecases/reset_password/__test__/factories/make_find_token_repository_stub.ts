import { FindTokenRepository } from '#shared/usecases/ports/find_token_repository'
import { TokenEntity, TokenTypes } from '#modules/auth/domain/entities/token_entity'
import { UniqueEntityID } from '#core/domain/unique_entity_id'

export const makeFindTokenRepositoryStub = (): FindTokenRepository => {
  return new (class implements FindTokenRepository {
    async find(_token: string): Promise<TokenEntity | undefined> {
      return TokenEntity.hydrate(new UniqueEntityID('valid_token_id'), {
        userId: new UniqueEntityID('valid_user_id'),
        revoked: false,
        expiredAt: new Date(),
        tokenType: TokenTypes.RECOVER_PASSWORD,
        token: _token,
      })
    }
  })()
}
