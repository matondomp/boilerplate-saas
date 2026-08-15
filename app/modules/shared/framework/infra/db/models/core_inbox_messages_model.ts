import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { StatusEnum } from '#shared/domain/types/status_type'

export class CoreInboxMessagesModel extends BaseModel {
  static table = 'core_inbox_messages'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare responsible: string

  @column()
  declare type: string

  @column()
  declare payload: any

  @column()
  declare metaUserId: string | null

  @column()
  declare metaOutboxId: string

  @column()
  declare status: StatusEnum.PENDING | StatusEnum.STARTED | StatusEnum.FAILED

  @column()
  declare complete: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async setId(inboxMessage: CoreInboxMessagesModel) {
    inboxMessage.id = inboxMessage.id || randomUUID()
  }
}
