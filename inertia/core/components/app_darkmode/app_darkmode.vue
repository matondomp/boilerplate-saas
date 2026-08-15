<script lang="ts" setup>
import { ref } from 'vue'
import { UseDark } from '@vueuse/components'
import { useDark, useToggle } from '@vueuse/core'
import { AppIcon, AppTooltip } from '../index.js'

const isDark = useDark({
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleDark = useToggle(isDark)
const themes = ref([
  { icon: 'sun', value: 'light' },
  { icon: 'moon', value: 'dark', isDark: true },
])
</script>

<template>
  <UseDark>
    <AppTooltip
      :content="$t('shared.toggle_dark_mode', { state: isDark })"
      :classes="['tooltip-bottom']"
    >
      <template #target>
        <button
          type="button"
          class="text-gray-500 justify-center flex dark:text-gray-400 hover:bg-base-200 dark:hover:bg-base-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
          @click="toggleDark()"
        >
          <AppIcon
            v-for="theme in themes"
            :key="theme.icon"
            v-show="theme.isDark === isDark || (!theme.isDark && !isDark)"
            :icon="theme.icon"
            classes="text-gray-500 rounded-lg sm:flex hover:text-gray-900 hover:bg-base-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-base-300"
            :size="18"
          />
        </button>
      </template>
    </AppTooltip>
  </UseDark>
</template>
