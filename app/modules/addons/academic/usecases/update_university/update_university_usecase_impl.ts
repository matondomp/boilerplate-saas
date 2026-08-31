import { Either, left, right } from '#core/domain/index'
import {
  UpdateUniversityUseCase,
  UpdateUniversityUseCaseInput,
  UniversityAlreadyExistsError,
  UniversityNotFoundError,
} from '../../domain/index.js'
import {
  UpdateUniversityRepository,
} from './ports/index.js'
import {
  FindUniversityByNameRepository,
} from '../create_university/ports/index.js'
import { FindUniversityByIdRepository } from '../create_course/ports/index.js'

export class UpdateUniversityUseCaseImpl implements UpdateUniversityUseCase {
  constructor(
    private readonly findUniversityByIdRepository: FindUniversityByIdRepository,
    private readonly findUniversityByNameRepository: FindUniversityByNameRepository,
    private readonly updateUniversityRepository: UpdateUniversityRepository
  ) {}

  async perform(
    input: UpdateUniversityUseCaseInput
  ): Promise<Either<any, boolean>> {
    const university = await this.findUniversityByIdRepository.findById(input.id)
    if (!university) {
      return left(new UniversityNotFoundError())
    }

    if (input.name && input.name !== university.name) {
      const existing = await this.findUniversityByNameRepository.findByName(input.name)
      if (existing && existing.id.toString() !== input.id) {
        return left(new UniversityAlreadyExistsError())
      }
      university.changeName(input.name)
    }

    if (input.acronym) {
      university.changeAcronym(input.acronym)
    }

    if (input.status === 'ACTIVE') {
      university.activate()
    } else if (input.status === 'INACTIVE') {
      university.deactivate()
    }

    const validation = university.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    await this.updateUniversityRepository.update(university)

    return right(true)
  }
}
