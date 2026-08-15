interface Dashboard {
  name: string
  slug: string
  isDefault: boolean
}

export type RetrieveDashboardsUseCaseOutput = Dashboard[]
