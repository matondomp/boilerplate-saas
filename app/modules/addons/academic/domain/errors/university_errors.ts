import { DomainError, Result } from '#core/domain/index'

export class UniversityNameRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.university_name_required',
      error: UniversityNameRequiredError.name,
    })
  }
}

export class UniversityAcronymRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.university_acronym_required',
      error: UniversityAcronymRequiredError.name,
    })
  }
}

export class UniversityAlreadyExistsError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.university_already_exists',
      error: UniversityAlreadyExistsError.name,
    })
  }
}

export class UniversityNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.university_not_found',
      error: UniversityNotFoundError.name,
    })
  }
}

export class UniversityInactiveError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.university_inactive',
      error: UniversityInactiveError.name,
    })
  }
}
