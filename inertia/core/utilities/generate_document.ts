export const generateDocument = (props: GenerateDocuments): void => {
  const document = new Blob([props.blob], { type: mediaTypes[props.format] })
  const documentUrl = URL.createObjectURL(document)
  window.open(documentUrl)
  URL.revokeObjectURL(documentUrl)
}

export enum DocsFormats {
  PDF = 'pdf',
  XLSX = 'xlsx',
}
interface GenerateDocuments {
  blob: Blob
  format: DocsFormats.PDF | DocsFormats.XLSX
}

const mediaTypes = {
  [DocsFormats.PDF]: 'application/pdf',
  [DocsFormats.XLSX]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // [DocsFormats.DOCX]: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}
