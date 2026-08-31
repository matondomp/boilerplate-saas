<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AppSidebarItem from './app_sidebar_item.vue'
import type { MenuProp } from '@core/types/menu.js'

const props = defineProps<{
  menus: MenuProp[]
  allUrls?: string[]
}>()

const url = computed(() => usePage().url.split('?')[0])
const activeOpenSlug = ref<string>('')

const isChildActive = (item: MenuProp): boolean => {
  if (!item.children) return false
  return item.children.some((child) => {
    const childTarget = child.url ? child.url.split('?')[0] : ''
    if (childTarget === url.value) return true
    if (childTarget !== '/' && childTarget !== '/admin' && url.value.startsWith(childTarget + '/')) {
      if (props.allUrls) {
        const moreSpecific = props.allUrls.some((otherUrl) => {
          if (otherUrl === childTarget) return false
          return otherUrl.length > childTarget.length && (url.value === otherUrl || url.value.startsWith(otherUrl + '/'))
        })
        if (moreSpecific) return false
      }
      return true
    }
    return false
  })
}

// Automatically set active accordion group on initial load & navigation
watch(
  url,
  () => {
    if (!props.menus) return
    for (const menu of props.menus) {
      if (menu.children) {
        for (const item of menu.children) {
          if (isChildActive(item)) {
            activeOpenSlug.value = item.slug
            return
          }
        }
      }
    }
  },
  { immediate: true }
)

const handleToggleMenu = (slug: string) => {
  if (activeOpenSlug.value === slug) {
    activeOpenSlug.value = 'NONE'
  } else {
    activeOpenSlug.value = slug
  }
}
</script>

<template>
  <template v-for="menu in props.menus" :key="menu.slug">
    <li v-if="menu.isGroup" class="nav-header hidden-folded">
      <span class="opacity-50 ml-3 text-gray-50 dark:opacity-30 font-medium text-sm mt-7">
        {{ $t(menu.display) }}
      </span>
    </li>
    <li v-else>
      <a>
        <span class="nav-text">{{ $t(menu.display) }}</span>
      </a>
    </li>
    <AppSidebarItem
      v-for="item in menu.children"
      :key="'sub_' + item.slug"
      :item="item"
      :sub-slide="false"
      :active-open-slug="activeOpenSlug"
      :all-urls="allUrls"
      @toggle-menu="handleToggleMenu"
    />
  </template>
</template>
