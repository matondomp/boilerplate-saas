<script lang="ts" setup>
import { AppNotification, AppUserSettings } from '../index.js'
import { AppFullscreen, AppLanguage, AppDarkMode, RouterLink } from '@core/components/index.js'
import AppHeaderSearch from './app_header_search.vue'
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { AppHeaderProp } from '@core/types/app_header.js'

defineEmits(['toggle-sidebar'])

type HeaderProps = {
  showSidebar: Boolean
}

defineProps<HeaderProps>()

const headers = computed(() => usePage().props.headers as AppHeaderProp)
</script>

<template>
  <nav
    class="fixed z-30 md:z-[1] w-full border-b bg-blue-500 border-gray-200 dark:bg-base-200 dark:border-gray-700"
  >
    <div class="">
      <div class="flex justify-between h-full">
        <div class="flex">
          <div class="bg-white w-auto lg:w-64 px-4 flex items-center justify-center">
            <RouterLink href="/account/dashboard" class="flex items-center justify-center">
              <img
                src="/assets/imgs/logo.png"
                class="h-9 object-contain"
                alt="NEXA"
              />
            </RouterLink>
          </div>

          <div>
            <button
              aria-expanded="true"
              aria-controls="sidebar"
              class="p-2 text-gray-50 bg-transparent cursor-pointer hover:text-gray-300 block"
              @click="$emit('toggle-sidebar')"
            >
              <svg
                id="toggleSidebarMobileHamburger"
                :class="['w-6 h-6', { hidden: showSidebar }]"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                id="toggleSidebarMobileClose"
                :class="['w-6 h-6', { hidden: !showSidebar }]"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <img src="/assets/imgs/nexa_white_header.png" class="h-8 object-contain" alt="NEXA" />
        </div>

        <div class="flex items-center justify-center gap-3 pr-4">
          <AppFullscreen class="hidden sm:block" />
          <AppLanguage />
          <AppUserSettings />
        </div>
      </div>
    </div>
  </nav>
</template>
