import { CourseEntity, ExamEntity } from '../../../../domain/entities/index.js'
import {
  CreateExamRepository,
  FindCourseByIdRepository,
  FindExamByCourseYearPeriodRepository,
} from '../../../../usecases/create_exam/ports/index.js'
import { AcademicCourseModel, AcademicExamModel } from '../models/index.js'
import { CourseMapper, ExamMapper } from '../mappers/index.js'

export class ExamRepositoriesImpl
  implements
    FindCourseByIdRepository,
    FindExamByCourseYearPeriodRepository,
    CreateExamRepository
{
  constructor(
    private readonly examMapper: ExamMapper = new ExamMapper(),
    private readonly courseMapper: CourseMapper = new CourseMapper()
  ) {}

  async findById(id: string): Promise<CourseEntity | null> {
    const model = await AcademicCourseModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.courseMapper.toDomain(model)
  }

  async findByCourseYearPeriod(
    courseId: string,
    year: number,
    period: string
  ): Promise<ExamEntity | null> {
    const model = await AcademicExamModel.query()
      .where('course_id', courseId)
      .andWhere('year', year)
      .andWhere('period', period)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.examMapper.toDomain(model)
  }

  async create(exam: ExamEntity): Promise<void> {
    const model = await this.examMapper.toPersistence(exam)
    await model.save()
  }
}
