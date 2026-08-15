export interface UpdateUserInfoUseCaseInput {
  userId: string
  avatarUrl: string | undefined
  firstName: string
  lastName: string
  defaultLang?: string
  timezone?: string
}
