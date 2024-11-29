---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: Geins SDK
titleTemplate: Geins SDK

hero:
  name: Geins SDK
  text: A perfect developer experience
  tagline: Create immersive web experiences. Take advantage of the hybrid model that Geins offers it is open-source and built for the modern web.
  actions:
    - theme: brand
      text: Quickstart
      link: /guide/quickstart
    - theme: alt
      text: Explore the SDK
      link: /packages
  image:
    src: /img/geins-logo-badge-rel.png
    alt: Geins logo

features:
  - icon:
      light: /logo/geins-g-icon.svg
      dark: /logo/geins-g-icon-white.svg
    title: Integrated with Geins
    details: Fully integrated with Geins and easy to make your own.
    link: https://www.geins.io
  - icon:
      src: /img/nodejs-icon.svg
    title: Native node.js
    details: Fully native node.js support.
  - icon:
      src: /img/typescript-icon.svg
    title: TypeScript support
    details: Full typescript support out of the box
  - icon:
      src: /img/opensource-icon.svg
    title: Open Source
    details: MIT licensed and open source.
---

<style>
</style>
<script setup lang="ts">
import confetti from 'canvas-confetti'
import { inBrowser } from 'vitepress'

if (inBrowser) {  
  const colors = ['#F6F6F7', '#EC4619'];
   confetti({
    particleCount: 500,
    spread: 170,
    origin: { y: 0.6 },
    colors: colors
  })
  confetti({
    particleCount: 500,
    angle: 60,
    spread: 600,
    origin: { x: 0,y: 0 },
    colors: colors
  });
  confetti({
    particleCount: 500,
    angle: 120,
    spread: 600,
    origin: { x: 1,y: 0 },
    colors: colors
  });
}
</script>
