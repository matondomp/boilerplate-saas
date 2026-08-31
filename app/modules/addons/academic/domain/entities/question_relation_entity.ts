import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { QuestionNotFoundError } from '../errors/index.js'
import { QuestionRelationType } from '../value_objects/index.js'

export interface QuestionRelationProps {
  sourceQuestionId: UniqueEntityID
  targetQuestionId: UniqueEntityID
  relationType: QuestionRelationType
  createdAt?: Date
}

export class QuestionRelationEntity extends Entity<QuestionRelationProps> {
  get sourceQuestionId(): UniqueEntityID {
    return this.props.sourceQuestionId
  }

  get targetQuestionId(): UniqueEntityID {
    return this.props.targetQuestionId
  }

  get relationType(): QuestionRelationType {
    return this.props.relationType
  }

  validate(): Either<QuestionNotFoundError, boolean> {
    if (!this.props.sourceQuestionId || !this.props.targetQuestionId) {
      return left(new QuestionNotFoundError())
    }
    if (this.props.sourceQuestionId.equals(this.props.targetQuestionId)) {
      return left(new QuestionNotFoundError())
    }
    return right(true)
  }

  static create(props: QuestionRelationProps): Either<QuestionNotFoundError, QuestionRelationEntity> {
    const relation = new QuestionRelationEntity({
      sourceQuestionId: props.sourceQuestionId,
      targetQuestionId: props.targetQuestionId,
      relationType: props.relationType,
    })

    const validation = relation.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(relation)
  }

  static hydrate(
    id: UniqueEntityID,
    props: QuestionRelationProps,
    options?: Options
  ): QuestionRelationEntity {
    return new QuestionRelationEntity(props, id, options)
  }
}
