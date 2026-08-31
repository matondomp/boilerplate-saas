import { Either, left, right, UniqueEntityID } from '#core/domain/index'
import { GetStudentProfileInput, GetStudentProfileUseCase, StudentProfileEntity, StudentNotFoundError } from '../../domain/index.js'
import { FindStudentByUserIdRepository, FindStudentProfileByStudentIdRepository, SaveStudentProfileRepository } from './ports/index.js'

export class GetStudentProfileUseCaseImpl implements GetStudentProfileUseCase {
  constructor(
    private readonly findStudentByUserIdRepository: FindStudentByUserIdRepository,
    private readonly findStudentProfileByStudentIdRepository: FindStudentProfileByStudentIdRepository,
    private readonly saveStudentProfileRepository: SaveStudentProfileRepository
  ) {}

  async perform(input: GetStudentProfileInput): Promise<Either<StudentNotFoundError, StudentProfileEntity>> {
    const student = await this.findStudentByUserIdRepository.findByUserId(input.userId)
    if (!student) return left(new StudentNotFoundError())

    let profile = await this.findStudentProfileByStudentIdRepository.findByStudentId(student.id.toString())

    if (!profile) {
      const createdProfile = StudentProfileEntity.hydrate(new UniqueEntityID(), {
        studentId: student.id,
        fullName: 'Estudante',
      })
      await this.saveStudentProfileRepository.save(createdProfile)
      profile = createdProfile
    }

    return right(profile)
  }
}
