<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@core/utilities/cn.js'

interface DropdownProps {
  class?: any
  summary?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<DropdownProps>(), {
  summary: false,
  class: [],
  fullWidth: false,
})
</script>

<template>
  <template v-if="summary">
    <details :class="cn(['dropdown dropdown-end', { 'w-full': fullWidth }])">
      <summary
        tabindex="0"
        role="button"
        :class="
          cn([
            'flex text-sm dark:hover:text-white dark:focus:text-white hover:text-base-300 focus:text-base-300',
            { 'w-full': fullWidth },
            props.class,
          ])
        "
      >
        <slot name="header" />
      </summary>
      <ul
        tabindex="0"
        class="dropdown-content left-0 sm:left-auto rounded-box bg-base-100 min-w-52 z-[1] menu shadow"
      >
        <slot name="highlight" />
        <ul role="none">
          <slot />
        </ul>
      </ul>
    </details>
  </template>
  <template v-else>
    <div :class="cn(['dropdown dropdown-end', { 'w-full': fullWidth }])">
      <div
        tabindex="0"
        role="button"
        :class="
          cn([
            'flex text-sm dark:hover:text-white dark:focus:text-white hover:text-base-300 focus:text-base-300',
            { 'w-full': fullWidth },
            props.class,
          ])
        "
      >
        <slot name="header" />
      </div>
      <ul tabindex="0" class="dropdown-content rounded-box bg-base-100 min-w-52 z-[1] menu shadow">
        <slot name="highlight" />
        <ul role="none">
          <slot />
        </ul>
      </ul>
    </div>
  </template>
</template>
