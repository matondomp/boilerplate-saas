export enum Chart {
  LINE = 'LINE',
  BAR = 'BAR',
  PIZZA = 'PIZZA',
}

export type ChartTypes = Chart.LINE | Chart.BAR | Chart.PIZZA

export const Charts = Object.fromEntries(Object.entries(Chart).map(([key, value]) => [key, value]))

export const ChartsArrayValues = Object.entries(Chart).map(([_, value]) => value)
