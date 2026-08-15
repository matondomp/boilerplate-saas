import { Status, UserStatus } from '@core/types/index.js'

export const convertUserStatus = (status: UserStatus): Status => {
  if (status === 'ACTIVE') {
    return 'SUCCESS'
  }

  return 'DANGER'
}

export const getStatusText = (status: string): string => {
  if (status === 'ACTIVE') return 'admin.acl.users.status.active'

  return 'admin.acl.users.status.inactive'
}
