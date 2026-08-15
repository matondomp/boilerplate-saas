export interface DashboardItem {
  id: string
  name: string
  queryResult: any
  chartType: string
}

export type ListDashboardItemsUseCaseOutput = DashboardItem[]
