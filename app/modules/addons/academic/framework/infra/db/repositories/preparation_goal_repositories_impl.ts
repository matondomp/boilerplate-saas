import {
  CourseEntity,
  PreparationGoalEntity,
  UniversityEntity,
} from '../../../../domain/entities/index.js'
import {
  CreatePreparationGoalRepository,
  FindCourseByIdRepository,
  FindStudentGoalByCourseRepository,
  FindUniversityByIdRepository,
} from '../../../../usecases/create_preparation_goal/ports/index.js'
import {
  AcademicCourseModel,
  AcademicUniversityModel,
  StudentPreparationGoalModel,
} from '../models/index.js'
import { CourseMapper, PreparationGoalMapper, UniversityMapper } from '../mappers/index.js'

export class PreparationGoalRepositoriesImpl
  implements
    FindUniversityByIdRepository,
    FindCourseByIdRepository,
    FindStudentGoalByCourseRepository,
    CreatePreparationGoalRepository
{
  constructor(
    private readonly goalMapper: PreparationGoalMapper = new PreparationGoalMapper(),
    private readonly universityMapper: UniversityMapper = new UniversityMapper(),
    private readonly courseMapper: CourseMapper = new CourseMapper()
  ) {}

  async findById(id: string): Promise<UniversityEntity | CourseEntity | null> {
    const uniModel = await AcademicUniversityModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (uniModel) return this.universityMapper.toDomain(uniModel)

    const courseModel = await AcademicCourseModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (courseModel) return this.courseMapper.toDomain(courseModel)

    return null
  }

  async findCourseById(id: string): Promise<CourseEntity | null> {
    const model = await AcademicCourseModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.courseMapper.toDomain(model)
  }

  async findByStudentAndCourse(
    studentId: string,
    courseId: string
  ): Promise<PreparationGoalEntity | null> {
    const model = await StudentPreparationGoalModel.query()
      .where('student_id', studentId)
      .andWhere('course_id', courseId)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.goalMapper.toDomain(model)
  }

  async create(goal: PreparationGoalEntity): Promise<void> {
    const model = await this.goalMapper.toPersistence(goal)
    await model.save()
  }
}
