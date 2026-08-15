export interface ListDashboardDetailsOutput {
  dashboard: {
    name: string
    description: string
    id: string
    slug: string
  }
  items: {
    id: string
    name: string
    slug: string
    chartType: string
    queryResult: any
    x: number
    y: number
    width: number
    height: number
  }[]
}
