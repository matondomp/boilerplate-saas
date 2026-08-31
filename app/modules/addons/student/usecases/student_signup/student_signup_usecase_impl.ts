import { Either, left, right } from '#core/domain/index'
import { StudentEmailAlreadyExistsError } from '../../domain/index.js'
import {
  StudentSignupInput,
  StudentSignupOutput,
  FindUserByEmailRepository,
  CreateStudentAccountRepository,
} from './ports/index.js'

export class StudentSignupUseCaseImpl {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly createStudentAccountRepository: CreateStudentAccountRepository
  ) {}

  async perform(input: StudentSignupInput): Promise<Either<StudentEmailAlreadyExistsError, StudentSignupOutput>> {
    if (!input.email || !input.password || !input.fullName) {
      return left(new StudentEmailAlreadyExistsError())
    }

    const existingUser = await this.findUserByEmailRepository.findByEmail(input.email)
    if (existingUser) {
      return left(new StudentEmailAlreadyExistsError())
    }

    const result = await this.createStudentAccountRepository.createStudentAccount(input)
    return right(result)
  }
}
