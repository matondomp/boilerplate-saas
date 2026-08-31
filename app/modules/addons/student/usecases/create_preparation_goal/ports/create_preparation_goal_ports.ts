import { PreparationGoalEntity, StudentEntity } from '../../../domain/entities/index.js'

export interface FindStudentByUserIdRepository {
  findByUserId(userId: string): Promise<StudentEntity | null>
}

export interface CreateStudentRepository {
  create(student: StudentEntity): Promise<void>
}

export interface FindUniversityByIdPort {
  findUniversityById(id: string): Promise<{ id: string; isActive: boolean } | null>
}

export interface FindCourseByIdPort {
  findCourseById(id: string): Promise<{ id: string; universityId: string; isActive: boolean } | null>
}

export interface FindStudentGoalByCourseAndYearRepository {
  findByStudentCourseAndYear(studentId: string, courseId: string, targetYear: number): Promise<PreparationGoalEntity | null>
}

export interface CreatePreparationGoalRepository {
  create(goal: PreparationGoalEntity): Promise<void>
}
