// @ts-ignore
import Island from '@islands/hydration/svelte/island'
import { Props, Slots } from './types'

type Component = any

export default function createIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined = {}) {
  // eslint-disable-next-line no-new
  new Island({ target: el, props: { component, slots, props }, hydrate: true })

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, slots, component, framework: 'svelte' })
}