import { DomainError, Result } from '#core/domain/index'

export class ExamCourseRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.exam_course_required',
      error: ExamCourseRequiredError.name,
    })
  }
}

export class ExamYearRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.exam_year_required',
      error: ExamYearRequiredError.name,
    })
  }
}

export class ExamPeriodRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.exam_period_required',
      error: ExamPeriodRequiredError.name,
    })
  }
}

export class ExamAlreadyExistsError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.exam_already_exists',
      error: ExamAlreadyExistsError.name,
    })
  }
}

export class ExamNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.exam_not_found',
      error: ExamNotFoundError.name,
    })
  }
}

export class ExamAlreadyPublishedError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.exam_already_published',
      error: ExamAlreadyPublishedError.name,
    })
  }
}
