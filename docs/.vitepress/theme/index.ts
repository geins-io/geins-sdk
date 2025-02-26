// https://vitepress.dev/guide/custom-theme
import 'virtual:group-icons.css';
import { useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import Confetti from './components/Confetti.vue';
import CheckoutTokenGenerator from './components/geinsTools/CheckoutTokenGenerator.vue';
import GeinsSettings from './components/geinsTools/GeinsSettings.vue';
import GeinsSettingsValidated from './components/geinsTools/GeinsSettingsValidated.vue';
import './custom.css';
import Layout from './Layout.vue';
import './style.css';

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
    app.component('CheckoutTokenGenerator', CheckoutTokenGenerator);
    app.component('GeinsSettings', GeinsSettings);
    app.component('GeinsSettingsValidated', GeinsSettingsValidated);
  },
};
