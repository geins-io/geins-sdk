import { GeinsCore } from '@geins/core';
import { useRuntimeConfig } from '#app';

export function useGeinsCore() {
  const config = useRuntimeConfig();

  const geinsCore = new GeinsCore(config.public.geins.credentials);

  return {
    geinsCore,
  };
}
