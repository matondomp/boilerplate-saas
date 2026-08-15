<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@core/utilities/cn.js'

const props = withDefaults(defineProps<{ class?: HTMLAttributes['class']; summary?: boolean }>(), {
  summary: false,
  class: [],
})
</script>

<template>
  <template v-if="summary">
    <details class="dropdown dropdown-end">
      <summary
        tabindex="0"
        role="button"
        :class="
          cn([
            'flex text-sm dark:hover:text-white dark:focus:text-white hover:text-base-300 focus:text-base-300',
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
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        :class="
          cn([
            'flex text-sm dark:hover:text-white dark:focus:text-white hover:text-base-300 focus:text-base-300',
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
