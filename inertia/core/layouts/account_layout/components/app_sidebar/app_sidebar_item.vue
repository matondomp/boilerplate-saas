<script lang="ts" setup>
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import type { AppSidebarItemProp } from './types.js'
import { AppIcon, RouterLink } from '@core/components/index.js'
import AppSidebarItem from './app_sidebar_item.vue'

const props = defineProps<{
  item: AppSidebarItemProp['item']
  subSlide?: boolean
  activeOpenSlug?: string
  allUrls?: string[]
}>()

const emit = defineEmits<{
  (e: 'toggle-menu', slug: string): void
}>()

const currentUrl = computed(() => usePage().url.split('?')[0])

const isUrlActive = computed(() => {
  if (!props.item.url) return false
  const targetUrl = props.item.url.split('?')[0]

  // 1. Exact match
  if (targetUrl === currentUrl.value) return true

  // 2. Exclude root / base path from prefix matching
  if (targetUrl === '/' || targetUrl === '/admin') return false

  // 3. Prefix match
  if (!currentUrl.value.startsWith(targetUrl + '/')) return false

  // 4. Specificity check: If a more specific menu URL matches currentUrl, this item is not the active one!
  if (props.allUrls) {
    const moreSpecificExists = props.allUrls.some((otherUrl) => {
      if (otherUrl === targetUrl) return false
      return (
        otherUrl.length > targetUrl.length &&
        (currentUrl.value === otherUrl || currentUrl.value.startsWith(otherUrl + '/'))
      )
    })
    if (moreSpecificExists) return false
  }

  return true
})

const isExpanded = computed(() => {
  if (props.activeOpenSlug !== undefined && props.activeOpenSlug !== '') {
    return props.activeOpenSlug === props.item.slug
  }
  return props.item.children?.some((child) => {
    const childTarget = child.url ? child.url.split('?')[0] : ''
    return (
      childTarget === currentUrl.value ||
      (childTarget !== '/' && childTarget !== '/admin' && currentUrl.value.startsWith(childTarget + '/'))
    )
  }) ?? false
})

const toggle = () => {
  emit('toggle-menu', props.item.slug)
}
</script>

<template>
  <li>
    <template v-if="!item.children">
      <RouterLink
        :href="item.url"
        :class="[
          'flex items-center p-2 text-base text-gray-50 rounded-none hover:bg-blue-500 transition duration-75 group dark:text-gray-200 dark:hover:bg-base-300',
          { 'dark:bg-base-300 bg-blue-500': isUrlActive }
        ]"
      >
        <AppIcon
          v-if="item.icon"
          :icon="item.icon"
          classes="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-white"
        />
        <span class="ml-3 text-gray-300">{{ $t(item.display) }}</span>
      </RouterLink>
    </template>
    <template v-else>
      <button
        type="button"
        class="flex items-center w-full py-2 px-3 text-base text-gray-900 transition duration-75 rounded-none group hover:bg-blue-500 dark:text-cyan-400 dark:hover:bg-base-300"
        :aria-controls="'dropdown-' + item.slug"
        @click="toggle"
      >
        <AppIcon
          v-if="item.icon"
          :icon="item.icon"
          classes="flex-shrink-0 w-6 h-6 text-gray-300 transition duration-75 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-white"
        />
        <span class="flex-1 ml-3 text-left whitespace-nowrap text-gray-50">{{ $t(item.display) }}</span>
        <AppIcon
          :icon="isExpanded ? 'chevron-down' : 'chevron-left'"
          classes="flex-shrink-0 w-6 h-6 text-gray-300 transition duration-75 group-hover:text-gray-300 dark:text-gray-400 dark:group-hover:text-white"
        />
      </button>
    </template>
    <ul v-if="item.children" :id="'dropdown-' + item.slug" :class="['pl-7', { hidden: !isExpanded }]">
      <div class="bg-[#2c3b4147]">
        <AppSidebarItem
          v-for="(sub, i) in item.children"
          :key="i"
          :item="sub"
          :sub-slide="true"
          :active-open-slug="activeOpenSlug"
          :all-urls="allUrls"
          @toggle-menu="(s) => emit('toggle-menu', s)"
        />
      </div>
    </ul>
  </li>
</template>
