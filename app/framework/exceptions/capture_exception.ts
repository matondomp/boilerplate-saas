import * as Sentry from '@sentry/node'

export class CaptureException {
  /**
   * Capture an exception using Sentry.
   *
   * @param {string} exception - The exception to capture
   * @param {any} options - Options for capturing the exception
   * @return {Promise<void>} A promise that resolves when the exception is captured
   */
  static async capture(exception: string, options: any) {
    await Sentry.captureException(exception, options)
  }
}
