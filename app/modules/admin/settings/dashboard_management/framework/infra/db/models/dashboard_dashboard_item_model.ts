import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DashboardItemModel } from './dashboard_item_model.js'
import { DashboardModel } from './dashboard_model.js'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export class DashboardDashboardItemModel extends BaseModel {
  static table = 'core_dashboards_dashboard_items'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'dashboard_slug' })
  declare dashboardSlug: string

  @belongsTo(() => DashboardModel, {
    foreignKey: 'dashboardSlug',
  })
  declare dashboard: BelongsTo<typeof DashboardModel>

  @column({ columnName: 'item_id' })
  declare itemId: string

  @belongsTo(() => DashboardItemModel, {
    foreignKey: 'itemId',
  })
  declare item: BelongsTo<typeof DashboardItemModel>

  @column()
  declare width: number

  @column()
  declare height: number

  @column()
  declare x: number

  @column()
  declare y: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
