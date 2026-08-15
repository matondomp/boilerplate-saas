import { randomUUID } from 'node:crypto'
import { CoreNotificationUserModel } from './core_notification_user_model.js'
import { DateTime } from 'luxon'

import CoreUserModel from './core_user_model.js'
import { BaseModel, beforeCreate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export class CoreNotificationModel extends BaseModel {
  static table = 'core_notifications'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'notification_key' })
  declare notificationKey: string

  @column.dateTime()
  declare deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => CoreUserModel, {
    pivotTable: 'core_notifications_users',
    localKey: 'id',
    pivotForeignKey: 'notification_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof CoreUserModel>

  @hasMany(() => CoreNotificationUserModel, {
    localKey: 'id',
    foreignKey: 'notificationId',
  })
  declare platforms: HasMany<typeof CoreNotificationUserModel>

  @beforeCreate()
  static async setId(notification: CoreNotificationModel) {
    notification.id = randomUUID()
  }
}
