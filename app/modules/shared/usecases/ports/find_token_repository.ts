import { TokenEntity } from '#modules/auth/domain/entities/token_entity'

export interface FindTokenRepository {
  find(token: string): Promise<TokenEntity | undefined>
}
