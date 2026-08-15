<script setup lang="ts">
import { Props } from './types.js'

defineProps<Props>()

const model = defineModel({ type: Boolean })
</script>
<template>
  <label class="label cursor-pointer">
    <input type="checkbox" v-model="model" class="checkbox" />
    <span class="label-text ml-2">{{ display }}</span>
  </label>
</template>
