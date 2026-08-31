import { FindUniversityByIdPort, FindCourseByIdPort } from '../../../../usecases/create_preparation_goal/ports/index.js'
import { AcademicUniversityModel } from '#addons/academic/framework/infra/db/models/academic_university_model'
import { AcademicCourseModel } from '#addons/academic/framework/infra/db/models/academic_course_model'

export class AcademicLookupRepositoriesImpl implements FindUniversityByIdPort, FindCourseByIdPort {
  async findUniversityById(id: string): Promise<{ id: string; isActive: boolean } | null> {
    const uni = await AcademicUniversityModel.find(id)
    if (uni) {
      return { id: uni.id, isActive: uni.status === 'ACTIVE' }
    }
    return null
  }

  async findCourseById(id: string): Promise<{ id: string; universityId: string; isActive: boolean } | null> {
    const course = await AcademicCourseModel.find(id)
    if (course) {
      return { id: course.id, universityId: course.universityId, isActive: course.status === 'ACTIVE' }
    }
    return null
  }
}
