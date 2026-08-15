import { Entity, UniqueEntityID } from '#core/domain/index'

export enum TokenTypes {
  RECOVER_PASSWORD = 'recover_password',
}

export type TokenType = TokenTypes.RECOVER_PASSWORD

interface TokenProps {
  expiredAt: Date
  revoked: boolean

  token: string
  tokenType: TokenType
  userId: UniqueEntityID
}

export class TokenEntity extends Entity<TokenProps> {
  get expiredAt(): Date {
    return this.props.expiredAt
  }

  get isRevoked(): boolean {
    return this.props.revoked
  }

  get isExpired(): boolean {
    return this.expiredAt.getTime() < new Date().getTime()
  }

  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get token(): string {
    return this.props.token
  }

  get tokenType(): TokenType {
    return this.props.tokenType
  }

  revoke(): void {
    this.props.revoked = true
  }

  static hydrate(id: UniqueEntityID, props: TokenProps): TokenEntity {
    return new TokenEntity(props, id)
  }
}
