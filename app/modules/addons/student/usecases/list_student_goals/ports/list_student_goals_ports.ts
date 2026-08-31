import { PreparationGoalEntity, StudentEntity } from '../../../domain/entities/index.js'

export interface FindStudentByUserIdRepository {
  findByUserId(userId: string): Promise<StudentEntity | null>
}

export interface ListStudentGoalsRepository {
  listByStudentId(studentId: string): Promise<PreparationGoalEntity[]>
}
