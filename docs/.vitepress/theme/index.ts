// https://vitepress.dev/guide/custom-theme
import 'virtual:group-icons.css';
import DefaultTheme from 'vitepress/theme';
import Confetti from './components/Confetti.vue';
import CheckoutTokenGenerator from './components/geinsTools/CheckoutTokenGenerator.vue';
import GeinsSettings from './components/geinsTools/GeinsSettings.vue';
import GeinsSettingsStatus from './components/geinsTools/GeinsSettingsStatus.vue';
import CustomLayout from './CustomLayout.vue';
import './style.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,

  enhanceApp({ app }) {
    app.component('Confetti', Confetti);
    app.component('CheckoutTokenGenerator', CheckoutTokenGenerator);
    app.component('GeinsSettings', GeinsSettings);
    app.component('GeinsSettingsStatus', GeinsSettingsStatus);
  },
};
