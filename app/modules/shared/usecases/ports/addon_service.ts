import { AddonEntity } from '#shared/domain/entities/addon_entity'

export interface AddonService {
  findAll(): Promise<AddonEntity[]>
  findPackage(packageName: string): Promise<AddonEntity | undefined>
}
