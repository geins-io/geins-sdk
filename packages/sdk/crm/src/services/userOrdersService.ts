import type { GeinsUserOrdersType } from '@geins/types';
import { BaseApiService, logWrite } from '@geins/core';
import { queries } from '../graphql';
export class UserOrdersService extends BaseApiService {
  private async generateVars(variables: any) {
    return this.createVariables(variables);
  }

  async getRaw(variables: any): Promise<any> {
    const options = {
      query: queries.userOrders,
      variables: await this.generateVars(variables),
    };
    return this.runQuery(options);
  }

  async get(): Promise<GeinsUserOrdersType | undefined> {
    const options = {
      query: queries.userOrders,
      variables: await this.generateVars({}),
    };
    return await this.runQueryParsed<GeinsUserOrdersType>(options);
  }

  protected parseResult(result: any): GeinsUserOrdersType | undefined {
    if (!result || !result.data || !result.data.getOrders) {
      return undefined;
    }
    return result.data.getOrders as GeinsUserOrdersType;
  }
}
