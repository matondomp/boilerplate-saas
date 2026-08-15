export interface DocumentGeneratorProps {
  data: {
    [key: string]: any
  }
  format: string
  docTemplatePath: string
}

export interface DocumentGeneratorAdapter {
  generate(props: DocumentGeneratorProps): Promise<Buffer | string>
}
