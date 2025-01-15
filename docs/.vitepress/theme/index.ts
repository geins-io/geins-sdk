// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import { useRoute } from 'vitepress';
import type { Theme } from 'vitepress';
import Confetti from './components/Confetti.vue';
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import 'virtual:group-icons.css';
import './style.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: (props) => {
    const route = useRoute();
    return h(route.path === '/' ? Layout : DefaultTheme.Layout, props);
  },

  enhanceApp({ app, router, siteData }) {
    // add global components
    app.component('Confetti', Confetti);
    app.component('Layout', Layout);
  },
};
