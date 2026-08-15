import { CoreAlternativeDatabase } from './core_alternative_database.js'

export interface CoreUserActivitySchema {
  hash: string
  success: boolean
  userId: string | null
  error?: string
  sessionId: string
  ip: string
  operation: string
  createdAt: Date
}

export const CoreUserActivity =
  CoreAlternativeDatabase.collection<CoreUserActivitySchema>('CoreUserActivities')

export const installIndexesOnCoreUserActivity = async () => {
  await CoreUserActivity.createIndex({ userId: 1, createdAt: -1 })
  await CoreUserActivity.createIndex({ sessionId: 1, createdAt: -1 })
}
