import { Entity, UniqueEntityID } from '#core/domain/index'

export interface DashboardItemProps {
  name: string
  sqlRaw: string
  chartType: string
  slug: string
  width?: number
  height?: number
  x?: number
  y?: number
}

export class DashboardItemEntity extends Entity<DashboardItemProps> {
  get name(): string {
    return this.props.name
  }

  get sqlRaw(): string {
    return this.props.sqlRaw
  }

  get chartType(): string {
    return this.props.chartType
  }

  get slug(): string {
    return this.props.slug
  }

  get width(): number | undefined {
    return this.props.width
  }

  get height(): number | undefined {
    return this.props.height
  }

  get x(): number | undefined {
    return this.props.x
  }

  get y(): number | undefined {
    return this.props.y
  }

  changeChartType(chartType: string): void {
    this.props.chartType = chartType
  }

  changeSlug(slug: string): void {
    this.props.slug = slug
  }

  changeName(name: string): void {
    this.props.name = name
  }

  changeSqlRaw(sqlRaw: string): void {
    this.props.sqlRaw = sqlRaw
  }

  static hydrate(id: UniqueEntityID, props: DashboardItemProps): DashboardItemEntity {
    const dashboardItemEntity = new DashboardItemEntity(props, id)
    return dashboardItemEntity
  }
}
