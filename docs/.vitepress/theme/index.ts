// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import { useRoute } from 'vitepress';
import type { Theme } from 'vitepress';
import Confetti from './components/Confetti.vue';
import TopBanner from './components/TopBanner.vue'; // Import your banner component
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import './style.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: props => {
    const route = useRoute();
    return h(route.path === '/' ? Layout : DefaultTheme.Layout, props);
  },

  enhanceApp({ app, router, siteData }) {
    // add global components
    app.component('Confetti', Confetti);
    app.component('Layout', Layout);
    //app.component('TopBanner', TopBanner);
  },
} satisfies Theme;
