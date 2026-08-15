<script setup lang="ts">
import { cn } from '~/core/utilities/cn'
// import AvatarFallback from './fallback.png'

type Props = {
  source?: string
  initials: string
  classes?: string
  noFallback?: boolean
}

defineProps<Props>()
</script>
<template>
  <!--FwbAvatar
    :img="source ?? ''"
    :initials="initials"
    :rounded="rounded"
    bordered
    :size="size as any"
  / -->
  <div class="avatar placeholder">
    <div :class="cn('rounded-full', classes, { 'bg-neutral text-neutral-content': noFallback })">
      <template v-if="source">
        <img :src="source" :alt="initials" />
      </template>
      <!-- template v-else-if="!noFallback">
        <img :src="AvatarFallback" :alt="initials" />
      </template -->
      <template v-else>
        <span>{{ initials }}</span>
      </template>
    </div>
  </div>
</template>
