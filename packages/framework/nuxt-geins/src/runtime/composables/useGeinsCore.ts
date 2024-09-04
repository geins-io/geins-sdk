import { GeinsCore } from '@geins/core';
import { useRuntimeConfig } from '#app';

export function useGeinsCore() {
  const config = useRuntimeConfig();
  console.log("🚀 ~ useGeinsCore ~ config.public.geins.credentials:", config.public.geins.credentials)

  const geinsCore = new GeinsCore(config.public.geins.credentials);

  return {
    geinsCore,
  };
}
