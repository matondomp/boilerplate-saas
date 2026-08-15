interface DashboardItem {
  dashboardSlug: string
  itemId: string
  x: number
  y: number
  width: number
  height: number
}

export type UpdateDashboardItemsUseCaseInput = DashboardItem[]
