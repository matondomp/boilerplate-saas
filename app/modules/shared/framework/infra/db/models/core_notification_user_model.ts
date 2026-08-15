import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export class CoreNotificationUserModel extends BaseModel {
  static table = 'core_notifications_users'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'type' })
  declare type: 'platform' | 'email'

  @column()
  declare userId: string

  @column()
  declare notificationId: string

  @beforeCreate()
  static async setId(notification: CoreNotificationUserModel) {
    notification.id = randomUUID()
  }
}
