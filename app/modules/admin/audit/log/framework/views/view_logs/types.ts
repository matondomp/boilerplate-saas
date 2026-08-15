export type LogProps = {
  hash: string
  createdAt: Date
  title: string
  username: string
  source: string
  success: boolean
  errorMessage?: string
  summary: string
  fullLog: {
    [key: string]: string
  }
}

export type LogsWithPaginationProps = {
  pagination: {
    total: number
    perPage: number
    page: number
  }
  data: LogProps[]
}
