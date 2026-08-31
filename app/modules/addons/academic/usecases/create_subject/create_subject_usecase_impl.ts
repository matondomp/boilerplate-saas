import { Either, left, right } from '#core/domain/index'
import {
  CreateSubjectUseCase,
  CreateSubjectUseCaseInput,
  SubjectAlreadyExistsError,
  SubjectEntity,
} from '../../domain/index.js'
import { CreateSubjectRepository, FindSubjectByNameRepository } from './ports/index.js'

export class CreateSubjectUseCaseImpl implements CreateSubjectUseCase {
  constructor(
    private readonly findSubjectByNameRepository: FindSubjectByNameRepository,
    private readonly createSubjectRepository: CreateSubjectRepository
  ) {}

  async perform(input: CreateSubjectUseCaseInput): Promise<Either<any, { id: string }>> {
    const subjectOrError = SubjectEntity.create({
      name: input.name,
      description: input.description,
    })

    if (subjectOrError.isLeft()) {
      return left(subjectOrError.value)
    }

    const subject = subjectOrError.value

    const existing = await this.findSubjectByNameRepository.findByName(subject.name)
    if (existing) {
      return left(new SubjectAlreadyExistsError())
    }

    await this.createSubjectRepository.create(subject)

    return right({ id: subject.id.toString() })
  }
}
