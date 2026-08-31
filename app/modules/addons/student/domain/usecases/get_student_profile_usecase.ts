import { Either, UseCase } from '#core/domain/index'
import { StudentProfileEntity } from '../entities/index.js'
import { StudentNotFoundError } from '../errors/index.js'

export interface GetStudentProfileInput {
  userId: string
}

export type GetStudentProfileUseCase = UseCase<
  GetStudentProfileInput,
  Either<StudentNotFoundError, StudentProfileEntity>
>
