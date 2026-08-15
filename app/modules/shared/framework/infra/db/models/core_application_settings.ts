import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export class CoreApplicationSettings extends BaseModel {
  static table = 'core_application_settings'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare appName: string

  @column()
  declare appDesc: string

  @column()
  declare imageUrl: string | null

  @column()
  declare appColorPrimary: string

  @column()
  declare appColorSecondary: string

  @column()
  declare appBackgroundPrimaryColor: string

  @column()
  declare appBackgroundSecondaryColor: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async setId(applicationSettings: CoreApplicationSettings) {
    applicationSettings.id = applicationSettings.id || randomUUID()
  }
}
