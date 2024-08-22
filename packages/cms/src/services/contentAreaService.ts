import { GeinsAPILocalization, ContentAreaVariabels } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql'

export class ContentAreaService extends BaseApiService {

    async area(family:string, areaName:string, variables: ContentAreaVariabels = { }, localization: GeinsAPILocalization) {
        if (!variables) {
            throw new Error('variables is required');
        }
        if (!areaName || !family) {
            throw new Error('areaName and family is required');
        }
        // set areaName and family in variables for usability
        variables.areaName = areaName;
        variables.family = family;

        const vars = this.createVariables(variables, localization);
        return this.client.runQuery(queries.contentArea, vars);
    }

    async page(alias: string, variables: ContentAreaVariabels,localization: GeinsAPILocalization) {
        if (!alias) {
            throw new Error('Alias is required');
        }
        if (!variables) {
            throw new Error('variables is required');
        }

        // set alias to widgetAlias in variables gor usability
        variables.widgetAlias = alias;

        const vars = this.createVariables(variables, localization);
        return this.client.runQuery(queries.contentArea, vars);
    }
}
