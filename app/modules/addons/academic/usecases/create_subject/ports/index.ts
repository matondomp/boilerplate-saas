import { SubjectEntity } from '../../../domain/entities/index.js'

export interface FindSubjectByNameRepository {
  findByName(name: string): Promise<SubjectEntity | null>
}

export interface CreateSubjectRepository {
  create(subject: SubjectEntity): Promise<void>
}
