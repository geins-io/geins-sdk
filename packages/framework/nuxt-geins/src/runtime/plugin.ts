import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const { geinsLogInfo } = useGeinsLog();

  geinsLogInfo('module active');
});
