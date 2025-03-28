// https://vitepress.dev/guide/custom-theme
import 'virtual:group-icons.css';
import DefaultTheme from 'vitepress/theme';
import Confetti from './components/Confetti.vue';
import GeinsButton from './components/geins/GeinsButton.vue';
import GeinsCartForm from './components/geins/GeinsCartForm.vue';
import GeinsCheckoutTokenForm from './components/geins/GeinsCheckoutTokenForm.vue';
import GeinsColorInput from './components/geins/GeinsColorInput.vue';
import GeinsFormContainer from './components/geins/GeinsFormContainer.vue';
import GeinsFormGrid from './components/geins/GeinsFormGrid.vue';
import GeinsFormGroup from './components/geins/GeinsFormGroup.vue';
import GeinsInput from './components/geins/GeinsInput.vue';
import GeinsLoading from './components/geins/GeinsLoading.vue';
import GeinsSettingsForm from './components/geins/GeinsSettingsForm.vue';
import GeinsStatus from './components/geins/GeinsStatus.vue';
import GeinsToggle from './components/geins/GeinsToggle.vue';
import TagsInput from './components/TagsInput.vue';
import './custom.css';
import CustomLayout from './CustomLayout.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,

  enhanceApp({ app }) {
    app.component('Confetti', Confetti);
    app.component('GeinsSettingsForm', GeinsSettingsForm);
    app.component('GeinsCartForm', GeinsCartForm);
    app.component('GeinsStatus', GeinsStatus);
    app.component('GeinsToggle', GeinsToggle);
    app.component('GeinsFormContainer', GeinsFormContainer);
    app.component('GeinsFormGrid', GeinsFormGrid);
    app.component('GeinsFormGroup', GeinsFormGroup);
    app.component('GeinsInput', GeinsInput);
    app.component('GeinsButton', GeinsButton);
    app.component('GeinsCheckoutTokenForm', GeinsCheckoutTokenForm);
    app.component('GeinsColorInput', GeinsColorInput);
    app.component('GeinsLoading', GeinsLoading);
    app.component('TagsInput', TagsInput);
  },
};
