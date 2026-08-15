import { updateChartOptions } from '@core/chart_management.js'
import { events } from '@core/events.js'
import eventBus from '@core/event_bus.js'
import app_themes from '../app_themes'

export function useItemTheme({ chart }: any) {
  const updateChartTheme = (appTheme?: string) => {
    if (!appTheme) return
    const color = appTheme === app_themes.dark ? '#fff' : '#222'
    updateChartOptions.updateColor({ chart, color })
  }

  eventBus.on(events.app_theme_changed, (theme: string) => {
    updateChartTheme(theme)
  })

  const appTheme = localStorage.getItem('app-theme')
  updateChartTheme(appTheme!)
}
