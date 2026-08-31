export class StudentEmailAlreadyExistsError extends Error {
  readonly code = 400
  constructor() {
    super('Email já está registado na plataforma')
    this.name = 'StudentEmailAlreadyExistsError'
  }
}
