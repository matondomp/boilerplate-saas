export type Permission = {
  id: string
  description: string
  slug: string
  display: string
}

export type PermissionGroup = {
  title: string
  id: string
  children: Permission[]
}
