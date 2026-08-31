import { UniversityEntity } from '../../../domain/entities/index.js'

export interface UpdateUniversityRepository {
  update(university: UniversityEntity): Promise<void>
}
