import { CourseEntity, ExamEntity } from '../../../domain/entities/index.js'

export interface FindCourseByIdRepository {
  findById(id: string): Promise<CourseEntity | null>
}

export interface FindExamByCourseYearPeriodRepository {
  findByCourseYearPeriod(courseId: string, year: number, period: string): Promise<ExamEntity | null>
}

export interface CreateExamRepository {
  create(exam: ExamEntity): Promise<void>
}
