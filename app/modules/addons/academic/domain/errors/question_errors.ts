import { DomainError, Result } from '#core/domain/index'

export class QuestionStatementRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.question_statement_required',
      error: QuestionStatementRequiredError.name,
    })
  }
}

export class QuestionSubjectRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.question_subject_required',
      error: QuestionSubjectRequiredError.name,
    })
  }
}

export class QuestionTopicRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.question_topic_required',
      error: QuestionTopicRequiredError.name,
    })
  }
}

export class QuestionInvalidOptionCountError extends Result<DomainError> {
  constructor(details?: string) {
    super(false, {
      message: details || 'academic.errors.question_invalid_option_count',
      error: QuestionInvalidOptionCountError.name,
    })
  }
}

export class QuestionSingleChoiceMustHaveOneCorrectOptionError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.question_single_choice_must_have_one_correct_option',
      error: QuestionSingleChoiceMustHaveOneCorrectOptionError.name,
    })
  }
}

export class QuestionMultipleChoiceMustHaveAtLeastOneCorrectOptionError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.question_multiple_choice_must_have_at_least_one_correct_option',
      error: QuestionMultipleChoiceMustHaveAtLeastOneCorrectOptionError.name,
    })
  }
}

export class QuestionNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.question_not_found',
      error: QuestionNotFoundError.name,
    })
  }
}

export class QuestionInvalidStateTransitionError extends Result<DomainError> {
  constructor(from?: string, to?: string) {
    super(false, {
      message: 'academic.errors.question_invalid_state_transition',
      error: QuestionInvalidStateTransitionError.name,
      payload: { from, to },
    })
  }
}

export class QuestionOptimisticLockConflictError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.question_optimistic_lock_conflict',
      error: QuestionOptimisticLockConflictError.name,
    })
  }
}

export class QuestionUnauthorizedAccessError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.question_unauthorized_access',
      error: QuestionUnauthorizedAccessError.name,
    })
  }
}
