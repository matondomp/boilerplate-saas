interface Items {
  name: string
  chartType: string
  queryResult: any
  width: any
  height: any
  x: number
  y: number
}

export type RetrieveDashboardItemsUseCaseOutput = Items[]
