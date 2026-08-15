export type NotificationType = {
  type: string
  id: string
  title: string
}

export type CustomNotificationProp = {
  notifications: NotificationType[]
  activeNotifications: NotificationType[]
}
