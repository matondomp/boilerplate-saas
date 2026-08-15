<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { usePage } from '@inertiajs/vue3'
import { useOnline } from '@vueuse/core'
import { FwbBreadcrumb, FwbBreadcrumbItem } from 'flowbite-vue'
import { onMounted, onBeforeUnmount, ref, nextTick, computed, watch } from 'vue'

import http from './services.js'
import emitter from '@core/event_bus.js'
import SocketService from '@core/services/socket_io_client.js'
import { AppHead, AppAlert, AppButton, AppAlertStandalone } from '@core/components/index.js'
import { AppHeader, AppSidebar } from './components/index.js'
import { BrowserNotificationService } from '@core/services/browser_notification_service.js'
import { MenuProp, MenuUsePage, MenuPropDisplay, SocketNotificationData } from './types.js'

import { UserProp, Alert as AlertProp } from '@core/types/index.js'

import { initFlowbite } from 'flowbite'

const online = ref(useOnline())
const showBackOnline = ref(false)
const showSidebar = ref(false)
const loading = ref(false)
const alert = computed(() => usePage().props.alertGlobal as AlertProp)
const env = computed(() => usePage().props.env)

const { t } = useI18n()

const animate = ref(false)
const user = computed(() => usePage().props.user as UserProp)
const isImpersonating = computed(() => usePage().props.impersonated)
const breadcrumbPath = computed(() => {
  const activeRoute = usePage().url.split('?')[0]

  const activeMenu = usePage<MenuUsePage>().props.menu.find((m: MenuProp) =>
    m.children?.find((c) => c.url === activeRoute)
  )

  if (!activeMenu) {
    return []
  }

  return lookupMenu(activeMenu, activeRoute, [{ display: activeMenu.display, url: activeMenu.url }])
})

const lookupMenu = (
  menu: MenuProp,
  match: string,
  rest: MenuPropDisplay[] = []
): MenuPropDisplay[] => {
  const current = menu.children?.find((a) => a.url === match)

  if (!current) {
    return rest
  }

  rest.push({ display: current.display, url: current.url })

  if (!current.children) {
    return rest
  }

  return lookupMenu(current, match, rest)
}

const onStopImpersonate = async () => {
  loading.value = true

  http.stopImpersonate().finally(() => {
    loading.value = false
  })
}

type AccountLayoutProps = {
  title: string
  bT: string
  bD?: string
  noPadding?: boolean
}

defineProps<AccountLayoutProps>()

onMounted(() => {
  BrowserNotificationService.requestNotificationPermission()
  nextTick(() => {
    initFlowbite()
    SocketService.setupSocketConnection()
    animate.value = true

    SocketService.socket.emit('connected', {
      username: user.value.slug,
    })

    SocketService.socket.on('alert', (data: SocketNotificationData) => {
      if (data.eventName === 'USER_BLOCKED') {
        emitter.emit('logout')
      }

      BrowserNotificationService.notify(t(data.title), {
        body: t(data.message),
        icon: data.icon,
        type: data.type,
      })
    })
  })
})

watch(online, (v) => {
  if (v) {
    showBackOnline.value = true

    setTimeout(() => {
      showBackOnline.value = false
    }, 3000)
  }
})

onBeforeUnmount(() => {
  SocketService.socket.disconnect()
})
</script>

<template>
  <AppHead :title="title" />
  <AppHeader :show-sidebar="showSidebar" @toggle-sidebar="() => (showSidebar = !showSidebar)" />
  <div class="flex pt-16">
    <AppSidebar :show-sidebar="showSidebar" />
    <div class="fixed inset-0 z-10 hidden" />
    <div class="relative w-full h-full lg:ml-64">
      <main class="min-h-[90vh] pt-8">
        <div class="px-4">
          <header>
            <div class="mb-4">
              <AppAlertStandalone
                class="mb-3"
                v-if="env !== 'LOCAL'"
                :type="env === 'PRODUCTION' ? 'error' : 'warning'"
                icon
              >
                {{ env === 'PRODUCTION' ? $t('shared.inProduction') : $t('shared.inStaging') }}
              </AppAlertStandalone>

              <AppAlertStandalone v-if="alert" :type="alert.success ? 'success' : 'error'" icon>
                {{ $t(alert.message) }}
              </AppAlertStandalone>

              <AppAlertStandalone v-if="showBackOnline || !online" type="error" border>
                {{ $t('shared.offline') }}
              </AppAlertStandalone>

              <AppAlertStandalone v-if="isImpersonating" type="warning" icon>
                <div
                  class="flex flex-col md:flex-row w-full items-center justify-between align-middle"
                >
                  {{ $t('shared.you_are_impersonating_now') }}

                  <AppButton
                    size="xs"
                    color="alternative"
                    :loading="loading"
                    @click="onStopImpersonate"
                  >
                    {{ $t('shared.stop_impersonating') }}
                  </AppButton>
                </div>
              </AppAlertStandalone>
            </div>

            <FwbBreadcrumb>
              <FwbBreadcrumbItem href="/" home>
                {{ $t('shared.account') }}
              </FwbBreadcrumbItem>
              <FwbBreadcrumbItem v-for="path in breadcrumbPath" :key="path.url" :href="path.url">
                {{ $t(path.display) }}
              </FwbBreadcrumbItem>
            </FwbBreadcrumb>
          </header>
          <h1 class="mt-3 text-2xl font-extrabold dark:text-white">
            {{ bT }}
          </h1>
          <p
            class="text-sm font-light mt-1 text-gray-500 lg:text-sm dark:text-gray-400"
            v-html="bD"
          />
        </div>
        <div class="m-4">
          <AppAlert />
        </div>
        <!-- <transition name="slide-fade" mode="out-in"> -->
        <div :class="{ 'p-4': !noPadding }" v-if="animate">
          <slot name="body" />
        </div>
        <!-- </transition> -->
      </main>
    </div>
  </div>
  <slot name="portal"></slot>
</template>

