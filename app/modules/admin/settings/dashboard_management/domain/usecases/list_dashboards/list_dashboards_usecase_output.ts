export interface Dashboard {
  slug: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type ListDashboardsUseCaseOutput = Dashboard[]
