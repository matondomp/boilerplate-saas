<script lang="ts" setup>
import { usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import type { AppSidebarItemProp } from './types.js'
import { AppIcon, RouterLink } from '@core/components/index.js'
import AppSidebarItem from './app_sidebar_item.vue'

const props = defineProps<AppSidebarItemProp>()

const url = computed(() => usePage().url)
const hasActiveChild = computed(() => {
  return props.item.children?.some((child) => url.value.startsWith(child.url)) ?? false
})

const show = ref(hasActiveChild.value)
</script>

<template>
  <li>
    <template v-if="!item.children">
      <RouterLink
        :href="item.url"
        :class="[
          'flex  items-center p-2 text-base text-gray-50 rounded-none hover:bg-blue-500 transition duration-75 group dark:text-gray-200 dark:hover:bg-base-300',
          { 'dark:bg-base-300': url.startsWith(item.url) },
          { 'bg-blue-500': url.startsWith(item.url) },
        ]"
      >
        <AppIcon
          v-if="item.icon"
          :icon="item.icon"
          classes="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-white"
        />
        <span class="ml-3 text-gray-300">{{ $t(item.display) }} </span>
      </RouterLink>
    </template>
    <template v-else>
      <button
        type="button"
        class="flex items-center w-full py-2 px-3 text-base text-gray-900 transition duration-75 rounded-none group hover:bg-blue-500 dark:text-cyan-400 dark:hover:bg-base-300"
        aria-controls="dropdown-layouts"
        data-collapse-toggle="dropdown-layouts"
        @click="() => (show = !show)"
      >
        <AppIcon
          v-if="item.icon"
          :icon="item.icon"
          classes="flex-shrink-0 w-6 h-6 text-gray-300 transition duration-75 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-white"
        />
        <span class="flex-1 ml-3 text-left whitespace-nowrap text-gray-50">{{ $t(item.display) }}</span>
        <AppIcon
          v-if="item.icon"
          :icon="show ? 'chevron-down' : 'chevron-left'"
          classes="flex-shrink-0 w-6 h-6 text-gray-300 transition duration-75 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-white"
        />
        <!-- <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg> -->
      </button>
    </template>
    <ul v-if="item.children" id="dropdown-layouts" :class="['pl-7', { hidden: !show }]">
      <div class="bg-[#2c3b4147]">
        <AppSidebarItem v-for="(sub, i) in item.children" :key="i" :item="sub" :sub-slide="true" />
      </div>
    </ul>
  </li>
</template>
