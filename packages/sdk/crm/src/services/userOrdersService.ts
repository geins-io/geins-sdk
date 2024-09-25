import type { GeinsUserOrdersType } from '@geins/types';
import { BaseApiService, logWrite } from '@geins/core';
import { queries } from '../graphql';
export class UserOrdersService extends BaseApiService {
  private async generateVars(variables: any) {
    return this.createVariables(variables);
  }

  async getRaw(variables: any): Promise<any> {
    const vars = await this.generateVars(variables);
    return this.runQuery(queries.userOrders, vars);
  }

  async get(): Promise<GeinsUserOrdersType | null> {
    const vars = await this.generateVars({});
    return await this.runQueryParsed<GeinsUserOrdersType>(
      queries.userOrders,
      vars,
    );
  }

  protected parseResult(result: any): GeinsUserOrdersType | null {
    if (!result || !result.data || !result.data.getOrders) {
      return null;
    }
    return result.data.getOrders as GeinsUserOrdersType;
  }
}
