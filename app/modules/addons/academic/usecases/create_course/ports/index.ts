import { CourseEntity, UniversityEntity } from '../../../domain/entities/index.js'

export interface FindUniversityByIdRepository {
  findById(id: string): Promise<UniversityEntity | null>
}

export interface FindCourseByNameAndUniversityRepository {
  findByNameAndUniversity(name: string, universityId: string): Promise<CourseEntity | null>
}

export interface CreateCourseRepository {
  create(course: CourseEntity): Promise<void>
}
