import { CoreAlternativeDatabase } from './core_alternative_database.js'

export interface CoreDashboardSchema {
  name: string
  slug?: string
  description?: string
  items: any[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}
export const CoreDashboardModel =
  CoreAlternativeDatabase.collection<CoreDashboardSchema>('CoreDashboard')
