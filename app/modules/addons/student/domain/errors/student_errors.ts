import { DomainError, Result } from '#core/domain/index'

export class StudentNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.student_not_found',
      error: StudentNotFoundError.name,
    })
  }
}

export class StudentInactiveError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.student_inactive',
      error: StudentInactiveError.name,
    })
  }
}

export class StudentSuspendedError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.student_suspended',
      error: StudentSuspendedError.name,
    })
  }
}

export class PreparationGoalNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.goal_not_found',
      error: PreparationGoalNotFoundError.name,
    })
  }
}

export class PreparationGoalAlreadyExistsError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.goal_already_exists',
      error: PreparationGoalAlreadyExistsError.name,
    })
  }
}

export class PreparationGoalStudentRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.student_required',
      error: PreparationGoalStudentRequiredError.name,
    })
  }
}

export class PreparationGoalUniversityRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.university_required',
      error: PreparationGoalUniversityRequiredError.name,
    })
  }
}

export class PreparationGoalCourseRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.course_required',
      error: PreparationGoalCourseRequiredError.name,
    })
  }
}

export class CourseDoesNotBelongToUniversityError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.course_not_in_university',
      error: CourseDoesNotBelongToUniversityError.name,
    })
  }
}

export class InvalidGoalStatusTransitionError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.invalid_status_transition',
      error: InvalidGoalStatusTransitionError.name,
    })
  }
}

export class UniversityNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.university_not_found',
      error: UniversityNotFoundError.name,
    })
  }
}

export class UniversityInactiveError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.university_inactive',
      error: UniversityInactiveError.name,
    })
  }
}

export class CourseNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.course_not_found',
      error: CourseNotFoundError.name,
    })
  }
}

export class CourseInactiveError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'student.errors.course_inactive',
      error: CourseInactiveError.name,
    })
  }
}
