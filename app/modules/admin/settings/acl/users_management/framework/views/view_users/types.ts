import { UserProp } from '@core/types/user'

export type EditUserProps = UserProp & {
  roleSlug: string
  slug: string
  status: string
  isInternal: boolean
}
