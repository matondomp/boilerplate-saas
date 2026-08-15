import { randomUUID } from 'node:crypto'
import { CoreBroadcastEnum } from '#shared/domain/types/index'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export class CoreOutboxMessageModel extends BaseModel {
  static table = 'core_outbox_messages'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare routingKey: string

  @column()
  declare type: CoreBroadcastEnum

  @column()
  declare payload: {
    [key: string]: any
  }

  @column()
  declare metaUserId: string | null

  @column.dateTime()
  declare sentAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async setId(outboxMessage: CoreOutboxMessageModel) {
    outboxMessage.id = outboxMessage.id || randomUUID()
  }
}
