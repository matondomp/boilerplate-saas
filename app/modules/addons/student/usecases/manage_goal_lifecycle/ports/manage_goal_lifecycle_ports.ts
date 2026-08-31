import { PreparationGoalEntity, StudentEntity } from '../../../domain/entities/index.js'

export interface FindStudentByUserIdRepository {
  findByUserId(userId: string): Promise<StudentEntity | null>
}

export interface FindPreparationGoalByIdRepository {
  findById(goalId: string): Promise<PreparationGoalEntity | null>
}

export interface UpdatePreparationGoalRepository {
  update(goal: PreparationGoalEntity): Promise<void>
}
