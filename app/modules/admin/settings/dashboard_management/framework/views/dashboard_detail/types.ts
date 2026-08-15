import { Charts } from '@core/types/chart_types.js'

export type { DashboardForm as Dashboard } from '../dashboard_management/types.js'

export type DashboardItem = {
  id: string
  name: string
  sqlRaw: string
  chartType: string
  width?: number
  height?: number
  x?: number
  y?: number
  queryResult?: any
}

export type ItemCoord = {
  width: number
  height: number
  x: number
  y: number
}

export type QueryResult = {
  xColumn: number[]
  yColumn: number[]
}

export type DashboardItemProps = {
  x: number
  y: number
  width: number
  height: number
  name: string
  id: string
  chartType: Charts.BAR | Charts.LINE | Charts.PIZZA
  queryResult: QueryResult
  items: any[]
}

export type DashboardIsolatedItems = {
  chartType: Charts.BAR | Charts.LINE | Charts.PIZZA
  readyToDrop: boolean
  queryResult: QueryResult
  items: any[]
}
