import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'

export default defineConfig({
  components: {
    resolvers: [iconsResolver({ componentPrefix: '' })],
  },
  pages: {
    extendRoute (route) {
      if (route.path.startsWith('/posts') && route.path !== '/posts')
        return { ...route, meta: { ...route.meta, layout: 'post' } }
    },
  },
  vite: {
    plugins: [
      icons(),
      windicss(),
    ],
  },
})