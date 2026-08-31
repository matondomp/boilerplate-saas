import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import {
  QuestionInvalidOptionCountError,
  QuestionInvalidStateTransitionError,
  QuestionMultipleChoiceMustHaveAtLeastOneCorrectOptionError,
  QuestionSingleChoiceMustHaveOneCorrectOptionError,
  QuestionStatementRequiredError,
  QuestionSubjectRequiredError,
  QuestionTopicRequiredError,
} from '../errors/index.js'
import {
  ContentSource,
  DifficultyLevel,
  QuestionStatus,
  QuestionType,
  SourceMetadata,
} from '../value_objects/index.js'
import { QuestionOptionEntity } from './question_option_entity.js'

type Errors =
  | QuestionStatementRequiredError
  | QuestionSubjectRequiredError
  | QuestionTopicRequiredError
  | QuestionInvalidOptionCountError
  | QuestionSingleChoiceMustHaveOneCorrectOptionError
  | QuestionMultipleChoiceMustHaveAtLeastOneCorrectOptionError
  | QuestionInvalidStateTransitionError

export interface QuestionProps {
  examId?: UniqueEntityID | null
  subjectId: UniqueEntityID
  topicId: UniqueEntityID
  type: QuestionType
  statement: string
  difficulty: DifficultyLevel
  solution?: string | null
  explanation?: string | null
  source: ContentSource
  sourceMetadata?: SourceMetadata | null
  status?: QuestionStatus
  version?: number
  options?: QuestionOptionEntity[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

const ALLOWED_TRANSITIONS: Record<QuestionStatus, QuestionStatus[]> = {
  [QuestionStatus.DRAFT]: [
    QuestionStatus.PROCESSING,
    QuestionStatus.UNDER_REVIEW,
    QuestionStatus.APPROVED,
    QuestionStatus.ARCHIVED,
  ],
  [QuestionStatus.PROCESSING]: [
    QuestionStatus.AI_PROCESSED,
    QuestionStatus.DRAFT,
    QuestionStatus.ARCHIVED,
  ],
  [QuestionStatus.AI_PROCESSED]: [
    QuestionStatus.UNDER_REVIEW,
    QuestionStatus.APPROVED,
    QuestionStatus.REJECTED,
    QuestionStatus.DRAFT,
  ],
  [QuestionStatus.UNDER_REVIEW]: [
    QuestionStatus.APPROVED,
    QuestionStatus.REJECTED,
    QuestionStatus.DRAFT,
  ],
  [QuestionStatus.APPROVED]: [
    QuestionStatus.PUBLISHED,
    QuestionStatus.UNDER_REVIEW,
    QuestionStatus.ARCHIVED,
    QuestionStatus.DRAFT,
    QuestionStatus.REJECTED,
  ],
  [QuestionStatus.PUBLISHED]: [
    QuestionStatus.ARCHIVED,
    QuestionStatus.UNDER_REVIEW,
    QuestionStatus.DRAFT,
    QuestionStatus.REJECTED,
  ],
  [QuestionStatus.REJECTED]: [QuestionStatus.DRAFT, QuestionStatus.ARCHIVED],
  [QuestionStatus.ARCHIVED]: [QuestionStatus.DRAFT],
}

export class QuestionEntity extends Entity<QuestionProps> {
  get examId(): UniqueEntityID | null | undefined {
    return this.props.examId
  }

  get subjectId(): UniqueEntityID {
    return this.props.subjectId
  }

  get topicId(): UniqueEntityID {
    return this.props.topicId
  }

  get type(): QuestionType {
    return this.props.type
  }

  get statement(): string {
    return this.props.statement
  }

  get difficulty(): DifficultyLevel {
    return this.props.difficulty
  }

  get solution(): string | null | undefined {
    return this.props.solution
  }

  get explanation(): string | null | undefined {
    return this.props.explanation
  }

  get source(): ContentSource {
    return this.props.source
  }

  get sourceMetadata(): SourceMetadata | null | undefined {
    return this.props.sourceMetadata
  }

  get status(): QuestionStatus {
    return this.props.status ?? QuestionStatus.DRAFT
  }

  get version(): number {
    return this.props.version ?? 1
  }

  get options(): QuestionOptionEntity[] {
    return this.props.options ?? []
  }

  get isPublished(): boolean {
    return this.status === QuestionStatus.PUBLISHED
  }

  changeStatement(statement: string): void {
    this.props.statement = statement.trim()
  }

  changeSolution(solution: string | null): void {
    this.props.solution = solution ? solution.trim() : null
  }

  changeExplanation(explanation: string | null): void {
    this.props.explanation = explanation ? explanation.trim() : null
  }

  changeDifficulty(difficulty: DifficultyLevel): void {
    this.props.difficulty = difficulty
  }

  changeTopic(topicId: UniqueEntityID): void {
    this.props.topicId = topicId
  }

  setOptions(options: QuestionOptionEntity[]): void {
    this.props.options = options
  }

  incrementVersion(): void {
    this.props.version = (this.props.version ?? 1) + 1
  }

  changeStatus(newStatus: QuestionStatus): Either<QuestionInvalidStateTransitionError, boolean> {
    const current = this.status
    const allowed = ALLOWED_TRANSITIONS[current] || []

    if (!allowed.includes(newStatus)) {
      return left(new QuestionInvalidStateTransitionError(current, newStatus))
    }

    this.props.status = newStatus
    return right(true)
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.subjectId) {
      return left(new QuestionSubjectRequiredError())
    }

    if (!this.props.topicId) {
      return left(new QuestionTopicRequiredError())
    }

    if (!this.props.statement || !this.props.statement.trim().length) {
      return left(new QuestionStatementRequiredError())
    }

    const options = this.props.options || []

    if (
      this.props.type === QuestionType.SINGLE_CHOICE ||
      this.props.type === QuestionType.MULTIPLE_CHOICE
    ) {
      if (options.length > 0) {
        if (options.length < 2) {
          return left(
            new QuestionInvalidOptionCountError(
              'academic.errors.question_choice_requires_minimum_two_options'
            )
          )
        }

        const correctOptions = options.filter((o) => o.isCorrect)

        if (this.props.type === QuestionType.SINGLE_CHOICE && correctOptions.length !== 1) {
          return left(new QuestionSingleChoiceMustHaveOneCorrectOptionError())
        }

        if (this.props.type === QuestionType.MULTIPLE_CHOICE && correctOptions.length < 1) {
          return left(new QuestionMultipleChoiceMustHaveAtLeastOneCorrectOptionError())
        }
      }
    }

    return right(true)
  }

  static create(props: QuestionProps): Either<Errors, QuestionEntity> {
    const question = new QuestionEntity({
      examId: props.examId ?? null,
      subjectId: props.subjectId,
      topicId: props.topicId,
      type: props.type || QuestionType.SINGLE_CHOICE,
      statement: props.statement?.trim(),
      difficulty: props.difficulty || DifficultyLevel.MEDIUM,
      solution: props.solution?.trim() || null,
      explanation: props.explanation?.trim() || null,
      source: props.source || ContentSource.OFFICIAL_EXAM,
      sourceMetadata: props.sourceMetadata ?? null,
      status: props.status || QuestionStatus.DRAFT,
      version: props.version ?? 1,
      options: props.options || [],
    })

    const validation = question.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(question)
  }

  static hydrate(id: UniqueEntityID, props: QuestionProps, options?: Options): QuestionEntity {
    return new QuestionEntity(props, id, options)
  }
}
