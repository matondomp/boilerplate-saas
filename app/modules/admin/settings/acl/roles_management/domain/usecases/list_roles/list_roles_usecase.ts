import { UseCase } from '#core/domain/index'
import {
  ListRolesUseCaseInput,
  ListRolesUseCaseOutput,
} from '#modules/admin/settings/acl/roles_management/domain/index'

export type ListRolesUseCase = UseCase<ListRolesUseCaseInput, ListRolesUseCaseOutput>
