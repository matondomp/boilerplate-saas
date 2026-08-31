import { UniversityEntity } from '../../../../domain/entities/index.js'
import {
  CreateUniversityRepository,
  FindUniversityByNameRepository,
} from '../../../../usecases/create_university/ports/index.js'
import { FindUniversityByIdRepository } from '../../../../usecases/create_course/ports/index.js'
import { AcademicUniversityModel } from '../models/index.js'
import { UniversityMapper } from '../mappers/index.js'
import { UpdateUniversityRepository } from '../../../../usecases/update_university/ports/index.js'

export class UniversityRepositoriesImpl
  implements
    FindUniversityByNameRepository,
    FindUniversityByIdRepository,
    CreateUniversityRepository,
    UpdateUniversityRepository
{
  constructor(private readonly mapper: UniversityMapper = new UniversityMapper()) {}

  async findByName(name: string): Promise<UniversityEntity | null> {
    const model = await AcademicUniversityModel.query()
      .where('name', name)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.mapper.toDomain(model)
  }

  async findById(id: string): Promise<UniversityEntity | null> {
    const model = await AcademicUniversityModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.mapper.toDomain(model)
  }

  async create(university: UniversityEntity): Promise<void> {
    const model = await this.mapper.toPersistence(university)
    await model.save()
  }

  async update(university: UniversityEntity): Promise<void> {
    const model = await this.mapper.toPersistence(university)
    await model.save()
  }
}
