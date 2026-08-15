import { AddonEntity } from '#shared/domain/entities/addon_entity'
import { AddonService } from '../../../usecases/ports/addon_service.js'
import { HttpClient } from '../../../usecases/ports/http_client.js'

type AddonRequest = {
  data: any[]
}
export class AddonServiceImpl implements AddonService {
  constructor(private readonly httpClient: HttpClient) {}

  findAll(): Promise<AddonEntity[]> {
    return this.httpClient.retrieve<AddonRequest>().then((addons: AddonRequest) => {
      return addons.data.map((addon) =>
        AddonEntity.create({
          name: addon.attributes.name,
          description: addon.attributes.description,
          url: addon.attributes.url,
          version: addon.attributes.version,
          lastUpdate: addon.attributes.updatedAt,
        })
      )
    })
  }

  findPackage(packageName: string): Promise<AddonEntity | undefined> {
    return this.httpClient
      .retrieve({
        'filters[name][$eq]': packageName,
      })
      .then(({ data: addons }: any) => {
        const addon = addons[0]
        if (!addon) {
          return
        }

        return AddonEntity.create({
          name: addon.attributes.name,
          description: addon.attributes.description,
          url: addon.attributes.url,
          lastUpdate: addon.attributes.updatedAt,
          version: addon.attributes.version,
        })
      })
  }
}
