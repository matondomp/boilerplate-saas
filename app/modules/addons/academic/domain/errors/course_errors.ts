import { DomainError, Result } from '#core/domain/index'

export class CourseNameRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.course_name_required',
      error: CourseNameRequiredError.name,
    })
  }
}

export class CourseUniversityRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.course_university_required',
      error: CourseUniversityRequiredError.name,
    })
  }
}

export class CourseAlreadyExistsError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.course_already_exists',
      error: CourseAlreadyExistsError.name,
    })
  }
}

export class CourseNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.course_not_found',
      error: CourseNotFoundError.name,
    })
  }
}

export class CourseInactiveError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.course_inactive',
      error: CourseInactiveError.name,
    })
  }
}
