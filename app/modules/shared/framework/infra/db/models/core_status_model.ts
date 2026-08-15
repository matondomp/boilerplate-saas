import { StatusEnum } from '#shared/domain/types/status_type'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class CoreStatusModel extends BaseModel {
  static table = 'core_statuses'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: StatusEnum

  @column()
  declare key: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
