import { StudentEntity, StudentProfileEntity } from '../../../domain/entities/index.js'

export interface FindStudentByUserIdRepository {
  findByUserId(userId: string): Promise<StudentEntity | null>
}

export interface FindStudentProfileByStudentIdRepository {
  findByStudentId(studentId: string): Promise<StudentProfileEntity | null>
}

export interface SaveStudentProfileRepository {
  save(profile: StudentProfileEntity): Promise<void>
}
