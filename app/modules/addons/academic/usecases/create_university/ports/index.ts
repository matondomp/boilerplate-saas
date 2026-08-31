import { UniversityEntity } from '../../../domain/entities/index.js'

export interface FindUniversityByNameRepository {
  findByName(name: string): Promise<UniversityEntity | null>
}

export interface CreateUniversityRepository {
  create(university: UniversityEntity): Promise<void>
}
