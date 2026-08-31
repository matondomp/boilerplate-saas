import {
  CourseEntity,
  PreparationGoalEntity,
  UniversityEntity,
} from '../../../domain/entities/index.js'

export interface FindUniversityByIdRepository {
  findById(id: string): Promise<UniversityEntity | null>
}

export interface FindCourseByIdRepository {
  findById(id: string): Promise<CourseEntity | null>
}

export interface FindStudentGoalByCourseRepository {
  findByStudentAndCourse(studentId: string, courseId: string): Promise<PreparationGoalEntity | null>
}

export interface CreatePreparationGoalRepository {
  create(goal: PreparationGoalEntity): Promise<void>
}
