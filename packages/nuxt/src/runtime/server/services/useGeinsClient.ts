import { GeinsCore } from '@geins/core'
import { useRuntimeConfig, useNuxtApp } from '#imports'

export const useGeinsClient = (): GeinsCore => {
  const nuxtApp = useNuxtApp()

  const { geins: config } = useRuntimeConfig().public

  // If medusa was registered in global plugin, just return reference to it.
  if (config.global) return nuxtApp.$geins as GeinsCore

  // Create client if it is not there.
  if (!nuxtApp._geinsClient) {
    nuxtApp._geinsClient = new GeinsCore(config)
  }

  return nuxtApp._geinsClient as GeinsCore
}
