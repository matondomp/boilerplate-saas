import { DomainError, Result } from '#core/domain/index'

export class PreparationGoalStudentRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.preparation_goal_student_required',
      error: PreparationGoalStudentRequiredError.name,
    })
  }
}

export class PreparationGoalUniversityRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.preparation_goal_university_required',
      error: PreparationGoalUniversityRequiredError.name,
    })
  }
}

export class PreparationGoalCourseRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.preparation_goal_course_required',
      error: PreparationGoalCourseRequiredError.name,
    })
  }
}

export class PreparationGoalAlreadyExistsError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.preparation_goal_already_exists',
      error: PreparationGoalAlreadyExistsError.name,
    })
  }
}

export class PreparationGoalNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.preparation_goal_not_found',
      error: PreparationGoalNotFoundError.name,
    })
  }
}

export class PreparationGoalInactiveInstitutionError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.preparation_goal_inactive_institution',
      error: PreparationGoalInactiveInstitutionError.name,
    })
  }
}
