import { UploadExamPdfController } from '../controllers/index.js'

export const makeUploadExamPdfControllerFactory = (): UploadExamPdfController => {
  return new UploadExamPdfController()
}
