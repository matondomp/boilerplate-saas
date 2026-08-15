export type MenuProp = {
  url: string
  slug: string
  icon?: string
  display: string
  isGroup: boolean
  children?: MenuProp[]
}

export type MenuUsePage = {
  menu: MenuProp[]
}

export type MenuPropDisplay = {
  display: string
  url: string
}
