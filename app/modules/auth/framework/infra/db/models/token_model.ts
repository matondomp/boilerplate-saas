import { DateTime } from 'luxon'

import type { TokenType } from '#modules/auth/domain/index'
import { CoreUserModel } from '#shared/framework/infra/index'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export class TokenModel extends BaseModel {
  static table = 'core_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: TokenType

  @column()
  declare abilities: string

  @column()
  declare hash: string

  @column()
  declare isRevoked: boolean

  @column()
  declare tokenableId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime()
  declare lastUsedAt: DateTime

  @belongsTo(() => CoreUserModel, {
    foreignKey: 'tokenableId',
  })
  declare user: BelongsTo<typeof CoreUserModel>
}
