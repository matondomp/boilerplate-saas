type Error = {
  field: string
  message: string
}

export default class Errors {
  #errors: Error[] = []

  has(field: string) {
    return this.#errors.some((err) => err.field === field)
  }

  any() {
    return !!this.#errors.length
  }

  get(field: string) {
    return this.#errors.find((err) => err.field === field)?.message
  }

  record(errors: Error[]) {
    this.#errors = errors
  }

  clear(field?: string) {
    if (field) {
      this.#errors = this.#errors.filter((err) => err.field !== field)
      return
    }

    this.#errors = []
  }
}
