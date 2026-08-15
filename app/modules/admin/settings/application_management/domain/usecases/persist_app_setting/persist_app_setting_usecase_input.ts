export interface PersistAppSettingUseCaseInput {
  appName: string
  appDesc: string
  imageUrl: string | undefined | null
  appColorPrimary: string
  appColorSecondary: string
  appBackgroundPrimaryColor: string
  appBackgroundSecondaryColor: string
}
