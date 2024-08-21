import { GeinsCore } from '@geins/core'
import { defineNuxtPlugin } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const { geins: config } = useRuntimeConfig().public

  const geinsClient = new GeinsCore(config)

  nuxtApp.provide('geins', geinsClient)
})
