export interface LogInterface {
  title: string
  success: boolean
  errorMessage?: string
  username: string
  source: string
  summary: string
  fullLog: FullLog
  userId: string
  createdAt: Date
}

export interface FullLog {
  [key: string]: string
}
