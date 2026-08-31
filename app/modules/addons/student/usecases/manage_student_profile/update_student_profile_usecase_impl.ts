import { Either, left, right, UniqueEntityID } from '#core/domain/index'
import { StudentProfileEntity, StudentNotFoundError } from '../../domain/index.js'
import { FindStudentByUserIdRepository, FindStudentProfileByStudentIdRepository, SaveStudentProfileRepository } from './ports/index.js'

export interface UpdateStudentProfileInput {
  userId: string
  fullName?: string
  phone?: string | null
  avatarUrl?: string | null
  preferredLanguage?: string
  birthYear?: number | null
}

export class UpdateStudentProfileUseCaseImpl {
  constructor(
    private readonly findStudentByUserIdRepository: FindStudentByUserIdRepository,
    private readonly findStudentProfileByStudentIdRepository: FindStudentProfileByStudentIdRepository,
    private readonly saveStudentProfileRepository: SaveStudentProfileRepository
  ) {}

  async perform(input: UpdateStudentProfileInput): Promise<Either<StudentNotFoundError, boolean>> {
    const student = await this.findStudentByUserIdRepository.findByUserId(input.userId)
    if (!student) return left(new StudentNotFoundError())

    let profile = await this.findStudentProfileByStudentIdRepository.findByStudentId(student.id.toString())

    if (!profile) {
      profile = StudentProfileEntity.hydrate(new UniqueEntityID(), {
        studentId: student.id,
        fullName: input.fullName || 'Estudante',
        phone: input.phone,
        avatarUrl: input.avatarUrl,
        preferredLanguage: input.preferredLanguage || 'pt',
        birthYear: input.birthYear,
      })
    } else {
      profile.updateProfile({
        fullName: input.fullName,
        phone: input.phone,
        avatarUrl: input.avatarUrl,
        preferredLanguage: input.preferredLanguage,
        birthYear: input.birthYear,
      })
    }

    await this.saveStudentProfileRepository.save(profile)
    return right(true)
  }
}
