import { CoreApplicationSettings } from '#shared/framework/infra/index'

type AppDetail = {
  appName: string
  appDesc: string
  appLogo: string | null | undefined
  appBackgroundPrimaryColor: string
  appBackgroundSecondaryColor: string
  appColorPrimary: string
  appColorSecondary: string
}

export const sharedAppDetails = async (): Promise<AppDetail | undefined> => {
  const appDetail = await CoreApplicationSettings.query().orderBy('createdAt', 'desc').first()

  if (!appDetail) {
    return {
      appName: 'NEXA',
      appDesc: 'NEXA Platform',
      appLogo: '/assets/imgs/nexa_header_dynamic.png',
      appBackgroundPrimaryColor: '#f9f9fa',
      appBackgroundSecondaryColor: '#f5f5f6',
      appColorPrimary: '#448bff',
      appColorSecondary: '#212529',
    }
  }

  return {
    appName: appDetail.appName,
    appDesc: appDetail.appDesc,
    appLogo: appDetail.imageUrl || '/assets/imgs/nexa_header_dynamic.png',
    appBackgroundPrimaryColor: appDetail.appBackgroundPrimaryColor,
    appBackgroundSecondaryColor: appDetail.appBackgroundPrimaryColor,
    appColorPrimary: appDetail.appColorPrimary,
    appColorSecondary: appDetail.appColorSecondary,
  }
}
