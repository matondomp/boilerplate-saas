import { CreateUserUseCaseInput } from '../create_user/index.js'

export interface UpdateUserUseCaseInput extends CreateUserUseCaseInput {
  username: string
}
