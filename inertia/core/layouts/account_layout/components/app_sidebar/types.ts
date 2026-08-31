import type { MenuProp } from '@core/types/menu.js'

export type SlidebarMenu = {
  menus: MenuProp[]
}

export type AppSidebarItemProp = {
  item: MenuProp
  subSlide?: boolean
  activeOpenSlug?: string | null
}
