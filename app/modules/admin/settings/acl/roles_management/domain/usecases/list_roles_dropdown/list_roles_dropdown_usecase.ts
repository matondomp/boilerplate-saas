import { UseCase } from '#core/domain/index'
import { ListRolesDropdownUseCaseOutput } from './list_roles_dropdown_usecase_output.js'

export type ListRolesDropdownUseCaseInput = {
  isRoot: boolean
}

export type ListRolesDropdownUseCase = UseCase<
  ListRolesDropdownUseCaseInput,
  ListRolesDropdownUseCaseOutput
>
