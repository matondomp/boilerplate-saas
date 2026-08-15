import { TokenEntity } from '#modules/auth/domain/index'

export interface UpdateTokenRepository {
  update(token: TokenEntity): Promise<void>
}
