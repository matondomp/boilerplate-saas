import { Either, IEventDispatcher, left, right } from '#core/domain/index'
import {
  CreateUniversityUseCase,
  CreateUniversityUseCaseInput,
  UniversityAlreadyExistsError,
  UniversityCreatedEvent,
  UniversityEntity,
} from '../../domain/index.js'
import {
  CreateUniversityRepository,
  FindUniversityByNameRepository,
} from './ports/index.js'

export class CreateUniversityUseCaseImpl implements CreateUniversityUseCase {
  constructor(
    private readonly findUniversityByNameRepository: FindUniversityByNameRepository,
    private readonly createUniversityRepository: CreateUniversityRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(
    input: CreateUniversityUseCaseInput
  ): Promise<Either<any, { id: string }>> {
    const entityOrError = UniversityEntity.create({
      name: input.name,
      acronym: input.acronym,
    })

    if (entityOrError.isLeft()) {
      return left(entityOrError.value)
    }

    const university = entityOrError.value

    const existing = await this.findUniversityByNameRepository.findByName(university.name)
    if (existing) {
      return left(new UniversityAlreadyExistsError())
    }

    await this.createUniversityRepository.create(university)

    await this.eventDispatcher.publish(
      new UniversityCreatedEvent({
        universityId: university.id,
        name: university.name,
        acronym: university.acronym,
      })
    )

    return right({ id: university.id.toString() })
  }
}
