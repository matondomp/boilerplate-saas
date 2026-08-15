<script lang="ts" setup>
import AppSidebarItem from './app_sidebar_item.vue'
import { SlidebarMenu } from './types.js'

defineProps<SlidebarMenu>()
</script>

<template>
  <template v-for="menu in menus" :key="menu.slug">
    <li v-if="menu.isGroup" class="nav-header hidden-folded" >
      <span class="opacity-50 ml-3 text-gray-50 dark:opacity-30 font-medium text-sm mt-7">{{
        $t(menu.display)
      }}</span>
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
    />
  </template>
</template>
