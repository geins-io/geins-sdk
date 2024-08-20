/* eslint-disable @typescript-eslint/no-unused-vars */

import { GeinsCore } from '@geins/core'
import { defineNuxtPlugin } from '#app'
import type { NuxtApp } from '#app'

interface NuxtPlugin {
  (nuxtApp: NuxtApp): void
}

const initBroadcastChannel = (geinsCore: GeinsCore | undefined): void => {
  try {
    const channel = geinsCore?.broadcastChannel
    if (channel) {
      console.log('BroadcastChannel initialized by GeinsCore')
    }
    else {
      console.log('BroadcastChannel already initialized')
    }
  }
  catch (error: unknown) {
    console.error('Failed to initialize BroadcastChannel:', error)
  }
}

const plugin: NuxtPlugin = (nuxtApp) => {
  const geins = new GeinsCore({ apiKey: '', accountName: '' })

  nuxtApp.hook('app:mounted', (app) => {
    initBroadcastChannel(geins)
  })
}

export default defineNuxtPlugin(plugin)
