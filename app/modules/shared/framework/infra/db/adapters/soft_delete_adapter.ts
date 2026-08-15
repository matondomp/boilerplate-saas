import { BaseModel } from '@adonisjs/lucid/orm'
import type { LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export const softDeleteQuery = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
  query.whereNull('deleted_at')
}

export const softDelete = async (row: LucidRow, column: string = 'deletedAt') => {
  if ((row as any)[column]) {
    if ((row as any)[column].isLuxonDateTime) {
      // Deleted represented by a datetime
      ;(row as any)[column] = DateTime.local()
    } else {
      // Deleted represented by a boolean
      ;(row as any)[column] = true
    }
    await row.save()
  }
}
