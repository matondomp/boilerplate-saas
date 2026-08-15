<script lang="ts" setup>
import type { InputProps } from './types.js'
import { computed } from 'vue'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  required: false,
})

const status = computed(() =>
  props.v && props.v.$dirty ? (props.v.$invalid ? 'error' : 'success') : undefined
)

const model = defineModel({ type: String })
</script>

<template>
  <label class="form-control w-full">
    <div v-if="label" class="label">
      <span class="label-text"
        >{{ label }} <span class="text-error" v-show="required">*</span></span
      >
    </div>
    <input
      :type="type"
      v-model="model"
      :placeholder="!placeholder && type === 'password' ? '••••••••' : placeholder"
      class="input input-bordered w-full text-base bg-transparent"
      :required="required"
      :name="name"
      :autocomplete="autocomplete"
    />
    <template v-if="v && status === 'error'">
      <span v-for="error in v.$errors"> {{ error.$message }}</span>
    </template>
  </label>
</template>
