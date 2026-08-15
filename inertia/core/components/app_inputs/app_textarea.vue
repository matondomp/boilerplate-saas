<script lang="ts" setup>
import type { TextareaProps } from './types.js'

withDefaults(defineProps<TextareaProps>(), {
  required: false,
  rows: 2,
})

const model = defineModel<string>()
</script>
<template>
  <label class="form-control">
    <div class="label">
      <span class="label-text">{{ label }}<span class="text-error" v-show="required">*</span></span>
    </div>
    <textarea
      v-model="model"
      class="textarea textarea-bordered h-24"
      :rows="rows"
      :required="required"
      :autocomplete="autocomplete"
      :min-length="minLength"
      :id="name"
      :name="name"
      :placeholder="placeholder"
    ></textarea>
  </label>
</template>
