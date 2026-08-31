<script setup lang="ts">
import { Props } from './types.js'

defineProps<Props>()

const model = defineModel<string | number | null>()
</script>

<template>
  <label class="form-control w-full">
    <div v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <select class="select select-bordered w-full" v-model="model">
      <option disabled :value="null">{{ label }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.name || option.label }}
      </option>
    </select>
  </label>
</template>
