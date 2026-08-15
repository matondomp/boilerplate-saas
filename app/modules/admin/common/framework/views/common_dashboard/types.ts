export type Dashboard = {
  slug: string
  name: string
  isDefault: boolean
}

export type DashboardOption = Omit<Dashboard, 'slug'> & {
  value: string
}

export type DashboardItem = {
  name: string
  x: number
  y: number
  width: number
  height: number
}
