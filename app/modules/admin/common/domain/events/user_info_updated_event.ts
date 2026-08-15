import { DomainEvent } from '#core/domain/index'

export interface UserInfoUpdatedProps {
  old: {
    avatarUrl?: string
    firstName: string
    lastName: string
    timezone: string
    defaultLang: string
  }
  new: {
    avatarUrl?: string
    firstName: string
    lastName: string
    timezone: string
    defaultLang: string
  }
}

export class UserInfoUpdatedEvent extends DomainEvent<UserInfoUpdatedProps> {}
