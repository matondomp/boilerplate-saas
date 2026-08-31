import { DomainError, Result } from '#core/domain/index'

export class AcademicUnitNameRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.academic_unit_name_required',
      error: AcademicUnitNameRequiredError.name,
    })
  }
}

export class AcademicUnitUniversityRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.academic_unit_university_required',
      error: AcademicUnitUniversityRequiredError.name,
    })
  }
}

export class AcademicUnitNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'academic.errors.academic_unit_not_found',
      error: AcademicUnitNotFoundError.name,
    })
  }
}
