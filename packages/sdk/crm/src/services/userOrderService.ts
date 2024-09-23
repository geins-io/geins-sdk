import type { UserOrdersOrderType } from '@geins/types';
import { BaseApiService, logWrite } from '@geins/core';
import { queries } from '../graphql';
import * as userOrdersParsers from '../parsers/userOrderParsers';
export class UserOrderService extends BaseApiService {
  private async generateVars(variables: any) {
    return this.createVariables(variables);
  }

  async allRaw(variables: any): Promise<any> {
    const vars = await this.generateVars(variables);
    return this.runQuery(queries.orders, vars);
  }

  async all(): Promise<UserOrdersOrderType[]> {
    const vars = await this.generateVars({});
    return this.runQueryParsed(queries.orders, vars);
  }

  async getRaw(variables: any): Promise<any> {
    const vars = await this.generateVars(variables);
    return this.runQuery(queries.orders, vars);
  }

  async get(): Promise<UserOrdersOrderType[]> {
    const vars = await this.generateVars({});
    return this.runQueryParsed(queries.order, vars);
  }

  protected parseResult(result: any): any {
    logWrite('UserOrderService.parseResult', result);
    return userOrdersParsers.parseUserOrders(result);
  }
}
