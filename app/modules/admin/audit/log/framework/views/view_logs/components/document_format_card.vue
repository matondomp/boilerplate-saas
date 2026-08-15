<script lang="ts" setup>
type Props = {
  format: string
}

defineProps<Props>()
</script>

<template>
  <li>
    <input
      id="hosting-small"
      type="radio"
      name="hosting"
      value="hosting-small"
      class="hidden peer"
      required
    />
    <label
      for="hosting-small"
      class="inline-flex items-center justify-between w-full py-3 px-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div class="block">
        <div class="w-full text-lg font-semibold">{{ format }}</div>
      </div>
      <app-icon icon="circle" :size="10" />
    </label>
  </li>
</template>
