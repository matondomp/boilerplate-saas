export type Notification = {
  hash: string
  routePath: string
  createdAt: string
  createdAtText: string
  message: string
  title: string
  event: string
  eventType: 'success' | 'error'
}
export type NotificationWithCount = {
  unRead: number
  notifications: Notification[]
}

export type NotificationItem = Omit<Notification, 'hash'>
