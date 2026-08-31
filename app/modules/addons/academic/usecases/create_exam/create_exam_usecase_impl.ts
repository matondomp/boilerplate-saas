import { Either, left, right, UniqueEntityID } from '#core/domain/index'
import {
  CourseNotFoundError,
  CreateExamUseCase,
  CreateExamUseCaseInput,
  ExamAlreadyExistsError,
  ExamEntity,
} from '../../domain/index.js'
import {
  CreateExamRepository,
  FindCourseByIdRepository,
  FindExamByCourseYearPeriodRepository,
} from './ports/index.js'

export class CreateExamUseCaseImpl implements CreateExamUseCase {
  constructor(
    private readonly findCourseByIdRepository: FindCourseByIdRepository,
    private readonly findExamByCourseYearPeriodRepository: FindExamByCourseYearPeriodRepository,
    private readonly createExamRepository: CreateExamRepository
  ) {}

  async perform(input: CreateExamUseCaseInput): Promise<Either<any, { id: string }>> {
    const course = await this.findCourseByIdRepository.findById(input.courseId)
    if (!course) {
      return left(new CourseNotFoundError())
    }

    const examOrError = ExamEntity.create({
      courseId: new UniqueEntityID(input.courseId),
      year: input.year,
      period: input.period,
      sourceType: input.sourceType as any,
      sourceMetadata: input.sourceMetadata,
      documentUrl: input.documentUrl,
    })

    if (examOrError.isLeft()) {
      return left(examOrError.value)
    }

    const exam = examOrError.value

    const existing = await this.findExamByCourseYearPeriodRepository.findByCourseYearPeriod(
      input.courseId,
      exam.year,
      exam.period
    )

    if (existing) {
      return left(new ExamAlreadyExistsError())
    }

    await this.createExamRepository.create(exam)

    return right({ id: exam.id.toString() })
  }
}
