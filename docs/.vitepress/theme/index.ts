// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import Confetti from './components/Confetti.vue';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import './custom.css';

export default {
  extends: DefaultTheme,

  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // add global components
    app.component('Confetti', Confetti);
  },
} satisfies Theme;
