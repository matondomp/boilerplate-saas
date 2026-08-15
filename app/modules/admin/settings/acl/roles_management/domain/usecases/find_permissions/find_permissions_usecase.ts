import { UseCase } from '#core/domain/index'
import { FindPermissionUseCaseOutput } from './find_permission_usecase_output.js'

export type FindPermissionsUseCase = UseCase<{ isRoot: boolean }, FindPermissionUseCaseOutput[]>
