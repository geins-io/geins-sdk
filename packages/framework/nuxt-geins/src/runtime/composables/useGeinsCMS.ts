import { GeinsCMS } from '@geins/cms';
import type { ContentAreaVariables, PageVariables } from '@geins/types';
import { useGeinsCore } from './useGeinsCore';

export function useGeinsCMS() {
  const { geinsCore } = useGeinsCore();
  console.log('🚀 ~ useGeinsCMS ~ geinsCore:', geinsCore);
  const geinsCMS = new GeinsCMS(geinsCore);
  console.log('🚀 ~ useGeinsCMS ~ geinsCMS:', geinsCMS);

  const getContentArea = async (variables: ContentAreaVariables) => {
    return await geinsCMS.contentArea.get(variables);
  };

  const getContentPage = async (variables: PageVariables) => {
    return await geinsCMS.page.get(variables);
  };

  return {
    geinsCMS,
    getContentArea,
    getContentPage,
  };
}
