import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { QuestionInvalidOptionCountError } from '../errors/index.js'

export interface QuestionOptionProps {
  questionId?: UniqueEntityID
  label: string
  content: string
  position: number
  isCorrect: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class QuestionOptionEntity extends Entity<QuestionOptionProps> {
  get questionId(): UniqueEntityID | undefined {
    return this.props.questionId
  }

  get label(): string {
    return this.props.label
  }

  get content(): string {
    return this.props.content
  }

  get position(): number {
    return this.props.position
  }

  get isCorrect(): boolean {
    return this.props.isCorrect
  }

  changeLabel(label: string): void {
    this.props.label = label.trim().toUpperCase()
  }

  changeContent(content: string): void {
    this.props.content = content.trim()
  }

  changePosition(position: number): void {
    this.props.position = position
  }

  setIsCorrect(isCorrect: boolean): void {
    this.props.isCorrect = isCorrect
  }

  setQuestionId(questionId: UniqueEntityID): void {
    this.props.questionId = questionId
  }

  validate(): Either<QuestionInvalidOptionCountError, boolean> {
    if (!this.props.label || !this.props.label.trim().length) {
      return left(new QuestionInvalidOptionCountError('academic.errors.option_label_required'))
    }

    if (!this.props.content || !this.props.content.trim().length) {
      return left(new QuestionInvalidOptionCountError('academic.errors.option_content_required'))
    }

    return right(true)
  }

  static create(props: QuestionOptionProps): Either<QuestionInvalidOptionCountError, QuestionOptionEntity> {
    const option = new QuestionOptionEntity({
      questionId: props.questionId,
      label: props.label?.trim()?.toUpperCase(),
      content: props.content?.trim(),
      position: props.position ?? 0,
      isCorrect: props.isCorrect ?? false,
    })

    const validation = option.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(option)
  }

  static hydrate(
    id: UniqueEntityID,
    props: QuestionOptionProps,
    options?: Options
  ): QuestionOptionEntity {
    return new QuestionOptionEntity(props, id, options)
  }
}
