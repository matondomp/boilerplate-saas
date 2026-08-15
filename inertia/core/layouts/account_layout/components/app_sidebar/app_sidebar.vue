<script lang="ts" setup>
import { AppSidebarGroup } from './index.js'
import { AppFooter, AppIcon } from '@core/components/index.js'
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { MenuProp } from '@core/types/index.js'

const menu = computed(() => usePage().props.menu as MenuProp[])

defineProps<{ showSidebar: boolean }>()
</script>

<template>
  <aside
    id="sidebar"
    :class="[
      'fixed top-0 left-0 z-20 md:z-0 flex justify-between flex-col flex-shrink-0 bg-[#02507C] border-r border-gray-200 dark:border-gray-700 w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width',
      { hidden: !showSidebar },
    ]"
    aria-label="Sidebar"
  >
    <div class="relative flex flex-col flex-1 min-h-0 pt-0">
      <div class="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
        <div class="flex-1 px-0 space-y-1 divide-y divide-gray-700 dark:divide-[#02507C]">
          <ul class="pb-2 space-y-2">
            <AppSidebarGroup :menus="menu" />
          </ul>
          <div class="pt-2 space-y-2">
            <a
              href="#"
              target="_blank"
              class="flex items-center p-2 text-base text-gray-300 transition duration-75 rounded-sm hover:bg-blue-500 group"
            >
              <AppIcon
                icon="help-circle"
                classes="flex-shrink-0 w-6 h-6 text-gray-300 transition duration-75 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-white"
              />
              <span class="ml-3">{{ $t('shared.support') }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <AppFooter  center-text="true"/>
  </aside>
  <div
    id="sidebarBackdrop"
    :class="['fixed inset-0 z-10 bg-gray-900/50 dark:bg-gray-900/90', { hidden: !showSidebar }]"
  />
</template>
