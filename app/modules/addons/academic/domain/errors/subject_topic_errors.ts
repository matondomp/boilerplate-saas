import { DomainError, Result } from '#core/domain/index'

export class SubjectNameRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.subject_name_required',
      error: SubjectNameRequiredError.name,
    })
  }
}

export class SubjectAlreadyExistsError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.subject_already_exists',
      error: SubjectAlreadyExistsError.name,
    })
  }
}

export class SubjectNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.subject_not_found',
      error: SubjectNotFoundError.name,
    })
  }
}

export class TopicNameRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.topic_name_required',
      error: TopicNameRequiredError.name,
    })
  }
}

export class TopicSubjectRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.topic_subject_required',
      error: TopicSubjectRequiredError.name,
    })
  }
}

export class TopicNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.topic_not_found',
      error: TopicNotFoundError.name,
    })
  }
}

export class TopicHierarchyCycleError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.topic_hierarchy_cycle',
      error: TopicHierarchyCycleError.name,
    })
  }
}
