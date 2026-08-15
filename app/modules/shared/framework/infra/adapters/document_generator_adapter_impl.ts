import {
  DocumentGeneratorAdapter,
  DocumentGeneratorProps,
} from '#modules/shared/domain/ports/document_generator_adapter'
import carbone from 'carbone'

export class DocumentGeneratorAdapterImpl implements DocumentGeneratorAdapter {
  generate(props: DocumentGeneratorProps): Promise<Buffer | string> {
    return new Promise((resolve, reject) => {
      carbone.render(
        props.docTemplatePath,
        props.data,
        { convertTo: props.format },
        (err, result) => {
          if (err) {
            reject(err)
          }

          resolve(result)
        }
      )
    })
  }
}
