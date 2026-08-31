import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { QuestionStatementRequiredError } from '../errors/index.js'

export interface QuestionRevisionProps {
  questionId: UniqueEntityID
  revisionNumber: number
  authorId: UniqueEntityID
  changesSummary: string
  snapshotData: Record<string, any>
  reason: string
  createdAt?: Date
}

export class QuestionRevisionEntity extends Entity<QuestionRevisionProps> {
  get questionId(): UniqueEntityID {
    return this.props.questionId
  }

  get revisionNumber(): number {
    return this.props.revisionNumber
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId
  }

  get changesSummary(): string {
    return this.props.changesSummary
  }

  get snapshotData(): Record<string, any> {
    return this.props.snapshotData
  }

  get reason(): string {
    return this.props.reason
  }

  validate(): Either<QuestionStatementRequiredError, boolean> {
    if (!this.props.questionId || !this.props.authorId || !this.props.reason?.trim().length) {
      return left(new QuestionStatementRequiredError())
    }
    return right(true)
  }

  static create(props: QuestionRevisionProps): Either<QuestionStatementRequiredError, QuestionRevisionEntity> {
    const revision = new QuestionRevisionEntity({
      questionId: props.questionId,
      revisionNumber: props.revisionNumber,
      authorId: props.authorId,
      changesSummary: props.changesSummary?.trim() || '',
      snapshotData: props.snapshotData,
      reason: props.reason?.trim(),
    })

    const validation = revision.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(revision)
  }

  static hydrate(
    id: UniqueEntityID,
    props: QuestionRevisionProps,
    options?: Options
  ): QuestionRevisionEntity {
    return new QuestionRevisionEntity(props, id, options)
  }
}
