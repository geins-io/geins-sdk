import { GeinsCMS } from '@geins/cms';
import { useGeinsCore } from './useGeinsCore';
import type { ContentAreaVariables } from '@geins/types';

export function useGeinsCMS() {
  const { geinsCore } = useGeinsCore();
  const geinsCMS = new GeinsCMS(geinsCore);

  const getContentArea = async (
    family: string,
    area: string,
    variables?: ContentAreaVariables,
  ) => {
    return await geinsCMS.content.area(family, area, variables);
  };

  const getContentPage = async (
    slug: string,
    variables?: ContentAreaVariables,
  ) => {
    return await geinsCMS.page.alias(slug, variables);
  };

  return {
    geinsCMS,
    getContentArea,
    getContentPage,
  };
}
