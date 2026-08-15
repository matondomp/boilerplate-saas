<script setup lang="ts">
import { Props } from './types.js'

const model = defineModel()
defineProps<Props>()
</script>

<template>
  <div class="form-control">
    <label class="label cursor-pointer">
      <span class="label-text">{{ display }}</span>
      <input :value="value" v-model="model" type="checkbox" class="toggle" checked />
    </label>
  </div>
</template>
