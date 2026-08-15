import { ChartTypes } from '../../types/chart_types.js'

export interface UpdateDashboardItemUseCaseInput {
  id: string
  name: string
  chartType: ChartTypes
  sqlRaw: string
}
