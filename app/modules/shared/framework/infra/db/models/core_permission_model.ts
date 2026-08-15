import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class CorePermissionModel extends BaseModel {
  static table = 'core_permissions'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'name' })
  declare display: string

  @column()
  declare description: string

  @column()
  declare group: string

  @column()
  declare internal: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
