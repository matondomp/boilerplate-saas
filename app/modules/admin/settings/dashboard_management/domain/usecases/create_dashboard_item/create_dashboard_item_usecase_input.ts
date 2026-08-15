import { ChartTypes } from '../../types/chart_types.js'

export interface CreateDashboardItemUseCaseInput {
  dashboardId: string
  chartType: ChartTypes
  name: string
  sqlRaw: string
  x: number
  y: number
  width: number
  height: number
}
