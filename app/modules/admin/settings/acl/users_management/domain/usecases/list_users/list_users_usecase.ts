import { UseCase } from '#core/domain/index'
import {
  ListUsersUseCaseInput,
  ListUsersUseCaseOutput,
} from '#modules/admin/settings/acl/users_management/domain/index'

export type ListUsersUseCase = UseCase<ListUsersUseCaseInput, ListUsersUseCaseOutput>
