import {
  BaseModel,
  belongsTo,
  beforeSave,
  column,
  computed,
  hasOne,
  manyToMany,
} from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import type { BelongsTo, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'

import { CoreRoleModel } from './core_role_model.js'
import { CoreStatusModel } from './core_status_model.js'
import type { StatusType } from '#shared/domain/types/index'
import { CoreNotificationModel } from './core_notification_model.js'
import { slugifyAdapter } from '#app/db/adapters/slugify_adapter_impl'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class CoreUserModel extends compose(BaseModel, AuthFinder) {
  static table = 'core_users'
  static selfAssignPrimaryKey = true
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(CoreUserModel, {
    table: 'core_remember_me_tokens',
  })

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  // @slugify({
  //   strategy: 'dbIncrement',
  //   fields: ['firstName', 'lastName'],
  // })
  declare slug: string

  @column()
  declare email: string

  @column({ columnName: 'avatar_url' })
  declare avatar?: string

  @column({ columnName: 'role_id' })
  declare roleId: string

  @column()
  forceChangePassword?: boolean

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare defaultLang: string

  @column()
  declare timezone: string

  @column({ columnName: 'status_id' })
  declare statusId: StatusType

  @hasOne(() => CoreStatusModel)
  declare status: HasOne<typeof CoreStatusModel>

  @column.dateTime({ columnName: 'last_login' })
  declare lastLoginAt?: DateTime

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => CoreRoleModel, {
    foreignKey: 'roleId',
  })
  declare role: BelongsTo<typeof CoreRoleModel>

  @manyToMany(() => CoreNotificationModel, {
    pivotTable: 'core_notifications_users',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'notification_id',
    onQuery: (query) => {
      query.preload('platforms')
    },
  })
  declare notifications: ManyToMany<typeof CoreNotificationModel>

  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName ?? ''}`
  }

  @beforeSave()
  static async setId(user: CoreUserModel) {
    user.id = user.id || randomUUID()
  }

  @beforeSave()
  static async setSlug(user: CoreUserModel) {
    if (!user.slug) {
      user.slug = await slugifyAdapter(user.fullName, {
        fieldName: 'slug',
        tableName: CoreUserModel.table,
      })
    }
  }
  static accessTokens = DbAccessTokensProvider.forModel(CoreUserModel, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'core_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}

export { CoreUserModel }
