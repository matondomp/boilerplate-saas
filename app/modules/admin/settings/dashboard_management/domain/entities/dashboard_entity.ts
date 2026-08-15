import { Entity, Options, UniqueEntityID } from '#core/domain/index'
import { StatusType } from '#shared/domain/types/index'

export interface DashboardProps {
  slug: string
  name: string
  isDefault: boolean
  description: string
  status?: StatusType
}

export class DashboardEntity extends Entity<DashboardProps> {
  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get isDefault(): boolean {
    return this.props.isDefault
  }

  get slug(): string {
    return this.props.slug
  }

  get status(): StatusType | undefined {
    return this.props.status
  }

  changeName(name: string): void {
    this.props.name = name
  }

  changeDescription(description: string): void {
    this.props.description = description
  }

  changeIsDefault(isDefault: boolean): void {
    this.props.isDefault = isDefault
  }

  changeSlug(slug: string): void {
    this.props.slug = slug
  }

  static hydrate(id: UniqueEntityID, props: DashboardProps, options?: Options): DashboardEntity {
    const dashboardEntity = new DashboardEntity(props, id, options)
    return dashboardEntity
  }
}
