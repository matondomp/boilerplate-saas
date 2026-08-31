import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import {
  ExamCourseRequiredError,
  ExamPeriodRequiredError,
  ExamYearRequiredError,
} from '../errors/index.js'
import { ContentSource, SourceMetadata } from '../value_objects/index.js'

type Errors = ExamCourseRequiredError | ExamYearRequiredError | ExamPeriodRequiredError

export interface ExamProps {
  courseId: UniqueEntityID
  year: number
  period: string
  sourceType: ContentSource
  sourceMetadata?: SourceMetadata | null
  documentUrl?: string | null
  status?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class ExamEntity extends Entity<ExamProps> {
  get courseId(): UniqueEntityID {
    return this.props.courseId
  }

  get year(): number {
    return this.props.year
  }

  get period(): string {
    return this.props.period
  }

  get sourceType(): ContentSource {
    return this.props.sourceType
  }

  get sourceMetadata(): SourceMetadata | null | undefined {
    return this.props.sourceMetadata
  }

  get documentUrl(): string | null | undefined {
    return this.props.documentUrl
  }

  get status(): string {
    return this.props.status ?? 'DRAFT'
  }

  get isPublished(): boolean {
    return this.status === 'PUBLISHED'
  }

  publish(): void {
    this.props.status = 'PUBLISHED'
  }

  archive(): void {
    this.props.status = 'ARCHIVED'
  }

  setDocumentUrl(url: string | null): void {
    this.props.documentUrl = url
  }

  updateDetails(year: number, period: string, sourceType: ContentSource, metadata?: SourceMetadata): void {
    this.props.year = year
    this.props.period = period.trim()
    this.props.sourceType = sourceType
    if (metadata) {
      this.props.sourceMetadata = metadata
    }
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.courseId) {
      return left(new ExamCourseRequiredError())
    }

    if (!this.props.year || this.props.year < 1900 || this.props.year > 2100) {
      return left(new ExamYearRequiredError())
    }

    if (!this.props.period || !this.props.period.trim().length) {
      return left(new ExamPeriodRequiredError())
    }

    return right(true)
  }

  static create(props: ExamProps): Either<Errors, ExamEntity> {
    const exam = new ExamEntity({
      courseId: props.courseId,
      year: props.year,
      period: props.period?.trim(),
      sourceType: props.sourceType || ContentSource.OFFICIAL_EXAM,
      sourceMetadata: props.sourceMetadata ?? null,
      documentUrl: props.documentUrl ?? null,
      status: props.status || 'DRAFT',
    })

    const validation = exam.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(exam)
  }

  static hydrate(id: UniqueEntityID, props: ExamProps, options?: Options): ExamEntity {
    return new ExamEntity(props, id, options)
  }
}
