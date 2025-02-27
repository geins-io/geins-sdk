// https://vitepress.dev/guide/custom-theme
import 'virtual:group-icons.css';
import DefaultTheme from 'vitepress/theme';
import Confetti from './components/Confetti.vue';
import CheckoutTokenGenerator from './components/geins/CheckoutTokenGenerator.vue';
import GeinsFormGrid from './components/geins/GeinsFormGrid.vue';
import GeinsFormGroup from './components/geins/GeinsFormGroup.vue';
import GeinsSettingsForm from './components/geins/GeinsSettingsForm.vue';
import GeinsStatus from './components/geins/GeinsStatus.vue';
import GeinsToggle from './components/geins/GeinsToggle.vue';
import './custom.css';
import CustomLayout from './CustomLayout.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,

  enhanceApp({ app }) {
    app.component('Confetti', Confetti);
    app.component('CheckoutTokenGenerator', CheckoutTokenGenerator);
    app.component('GeinsSettingsForm', GeinsSettingsForm);
    app.component('GeinsStatus', GeinsStatus);
    app.component('GeinsToggle', GeinsToggle);
    app.component('GeinsFormGrid', GeinsFormGrid);
    app.component('GeinsFormGroup', GeinsFormGroup);
  },
};
