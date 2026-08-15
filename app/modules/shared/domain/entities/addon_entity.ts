import { Entity } from '#core/domain/entity'

export interface AddonProps {
  url: string
  description: string
  name: string
  image?: string
  lastUpdate: Date
  version: Number
}

export class AddonEntity extends Entity<AddonProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get url() {
    return this.props.url
  }

  get lastUpdate() {
    return this.props.lastUpdate
  }

  get version() {
    return this.props.version
  }

  get image() {
    return this.props.image
  }

  static create(props: AddonProps): AddonEntity {
    return new AddonEntity(props)
  }
}
