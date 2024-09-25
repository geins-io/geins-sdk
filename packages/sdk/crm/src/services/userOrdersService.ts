import type { UserOrdersQuery } from '@geins/types';
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

  async get(): Promise<UserOrdersQuery['getOrders'] | null> {
    const vars = await this.generateVars({});
    return await this.runQueryParsed<UserOrdersQuery['getOrders']>(
      queries.userOrders,
      vars,
    );
  }

  protected parseResult(result: any): UserOrdersQuery['getOrders'] | null {
    if (!result || !result.data || !result.data.getOrders) {
      return null;
    }
    return result.data.getOrders as UserOrdersQuery['getOrders'];
  }
}
