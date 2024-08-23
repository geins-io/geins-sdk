import {
  ContentAreaVariables,
  PageServiceResult,
  ContentAreaType,
  ContentContainerType,
} from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
import * as contentParsers from '../util/contentParsers';

export class PageService extends BaseApiService {
  private async aliasVars(alias: string, variables?: ContentAreaVariables) {
    if (!alias) {
      throw new Error('Alias is required');
    }
    const combinedVariables = { ...variables, widgetAlias: alias };
    return this.createVariables(combinedVariables);
  }

  async alias(alias: string, variables?: ContentAreaVariables) {
    const vars = await this.aliasVars(alias, variables);
    return await this.runQuery(queries.contentArea, vars);
  }

  async aliasParsed(alias: string, variables?: ContentAreaVariables) {
    const vars = await this.aliasVars(alias, variables);
    return await this.runQueryParsed(queries.contentArea, vars);
  }

  protected parseResult(result: any): ContentAreaType {
    if (!result || !result.data || !result.data.widgetArea) {
      throw new Error('Invalid result structure');
    }

    const widgetArea = result.data.widgetArea;

    const parsedResult = {
      meta: this.parseMetaData(widgetArea.meta),
      tags: widgetArea.tags,
      containers: widgetArea.containers.map((item: any) =>
        this.parseContainer(item),
      ),
    };

    return parsedResult as ContentAreaType;
  }

  protected parseMetaData(meta: any) {
    return {
      title: meta.title,
      description: meta.description,
    };
  }

  protected parseContainer(container: any): ContentContainerType {
    const parsedContainer = {
      id: container.id,
      name: container.name,
      sortOrder: container.sortOrder,
      layout: container.layout,
      responsiveMode: container.responsiveMode,
      design: container.design,
      content: container.widgets.map((content: any) =>
        this.parseContent(content),
      ),
    };
    return parsedContainer;
  }

  protected parseContent(content: any) {
    const parsedContent = {
      name: content.name,
      //configuration: content.configuration,
    };
    return parsedContent;
  }
}
