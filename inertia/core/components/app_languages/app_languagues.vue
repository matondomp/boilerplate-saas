<script lang="ts" setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { UserProp } from '@core/types/user.js'
import { Language } from './types.js'
import { AppDropdown, AppDropdownItem, AppIcon } from '@core/components/index.js'

const user = computed(() => usePage().props.user as UserProp)
const availableLanguages = computed(() => usePage().props.i18n as Language[])
</script>
<template>
  <AppDropdown
    class="inline-flex justify-center relative p-2  text-gray-50  cursor-pointer hover:text-gray-300  uppercase"
  >
    <template #header>
      {{ user.defaultLang }}
    </template>
    <template #default>
      <AppDropdownItem class="py-1" v-for="lang of availableLanguages" :key="lang.key">
        <a class="cursor-pointer">
          <div class="inline-flex items-center">
            {{ lang.display }}
          </div>
        </a>
      </AppDropdownItem>
    </template>
  </AppDropdown>
</template>
