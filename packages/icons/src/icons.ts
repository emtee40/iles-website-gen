import type { IlesModule } from 'iles'
import type { Options } from 'unplugin-icons'

import icons from 'unplugin-icons/vite'
import iconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

interface ModuleOptions extends Options {
  resolver?: Parameters<typeof iconsResolver>[0]
}

/**
 * An iles module that configures unplugin-icons to autoInstall collections and
 * be able to use local icons in the /icons or /images directories.
 *
 * @param options - Optional options to configure the output.
 */
export default function IlesIcons (options?: ModuleOptions): IlesModule {
  const { resolver, ...iconsOptions } = options || {}

  return {
    name: '@islands/icons',
    components: {
      resolvers: [
        iconsResolver({
          prefix: 'icon',
          customCollections: ['app'],
          ...resolver,
        }),
      ],
    },
    vite: {
      plugins: [
        icons({
          autoInstall: true,
          customCollections: {
            app: FileSystemIconLoader('./icons'),
          },
          ...iconsOptions,
        }),
      ],
    },
  }
}
