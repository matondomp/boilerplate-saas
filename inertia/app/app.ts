import '../css/app.css'
import 'vue3-toastify/dist/index.css'
import 'vue-awesome-paginate/dist/style.css'
import { createApp, h } from 'vue'
import VueAwesomePaginate from 'vue-awesome-paginate'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import messages from '~/i18n/index.js'
import { messageCompiler } from '~/i18n/icu_format.js'

import { createI18n } from 'vue-i18n'

messages().then((m) => {
  const i18n = createI18n({
    locale: 'pt',
    legacy: false,
    messageCompiler,
    messages: m,
  })

  createInertiaApp({
    progress: { color: '#5468FF' },

    title: (title) => `${title}`,

    resolve: (component) => {
      const pages = import.meta.glob<DefineComponent>('../../app/modules/**/*_page.vue')

      const keys = Object.keys(pages)

      const c = keys.find((k) => k.includes(component))

      if (!c) {
        throw new Error(`${component} was not found!`)
      }

      return pages[c]()
    },

    setup({ el, App, props, plugin }) {
      createApp({ render: () => h(App, props) })
        .use(plugin)
        /* @ts-ignore */
        .use(VueAwesomePaginate)
        .use(i18n)
        .mount(el)
    },
  })
})
