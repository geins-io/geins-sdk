import { GeinsCMS } from '@geins/cms';
import type {
  ContentAreaVariables,
  ContentPageVariables,
  MenuVariables,
} from '@geins/types';
import { useGeinsCore } from './useGeinsCore';

export function useGeinsCMS() {
  const { geinsCore } = useGeinsCore();
  const geinsCMS = new GeinsCMS(geinsCore);

  const getContentArea = async (variables: ContentAreaVariables) => {
    return await geinsCMS.area.get(variables);
  };

  const getContentPage = async (variables: ContentPageVariables) => {
    return await geinsCMS.page.get(variables);
  };

  const getMenu = async (variables: MenuVariables) => {
    return await geinsCMS.menu.get(variables);
  };

  return {
    geinsCMS,
    getContentArea,
    getContentPage,
    getMenu,
  };
}
