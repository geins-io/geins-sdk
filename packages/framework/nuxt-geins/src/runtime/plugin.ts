import { defineNuxtPlugin } from '#app';
import { useGeinsLog } from './composables/useGeinsLog';

export default defineNuxtPlugin(() => {
  const { geinsLogInfo } = useGeinsLog();

  geinsLogInfo('module active');
});
