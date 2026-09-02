import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    vue(),
    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],
  server: {
    host: true,
    hmr: {
      host: 'localhost',
    },
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/build/**', '**/.git/**'],
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      '@inertiajs/vue3',
      'vue-i18n',
      'vue-awesome-paginate',
      'flowbite-vue',
      '@vuelidate/core',
      '@vuelidate/validators',
      '@heroicons/vue/24/outline',
    ],
  },
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
      '@core/': `${getDirname(import.meta.url)}/inertia/core/`,
      '@app/': `${getDirname(import.meta.url)}/app/modules/`,
    },
  },
})
