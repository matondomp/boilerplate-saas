import { Either, left, right } from '#core/domain/index'
import { StudentNotFoundError } from '../../domain/index.js'
import { FindStudentByIdRepository, UpdateStudentRepository } from './ports/index.js'

export interface UpdateStudentStatusInput {
  studentId: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export class UpdateStudentStatusUseCaseImpl {
  constructor(
    private readonly findStudentByIdRepository: FindStudentByIdRepository,
    private readonly updateStudentRepository: UpdateStudentRepository
  ) {}

  async perform(input: UpdateStudentStatusInput): Promise<Either<StudentNotFoundError, boolean>> {
    const student = await this.findStudentByIdRepository.findById(input.studentId)
    if (!student) return left(new StudentNotFoundError())

    if (input.status === 'ACTIVE') student.activate()
    else if (input.status === 'INACTIVE') student.deactivate()
    else if (input.status === 'SUSPENDED') student.suspend()

    await this.updateStudentRepository.update(student)
    return right(true)
  }
}
