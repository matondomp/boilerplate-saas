<script lang="ts" setup>
import { computed } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'
import { HeadProp, AppHeaderProp } from './types.js'

defineProps<HeadProp>()
const headers = computed(() => usePage().props.headers as AppHeaderProp)
</script>

<template>
  <Head :title="title ? `${title} · ${headers.appName}` : headers.appName">
    <slot />
  </Head>
</template>
