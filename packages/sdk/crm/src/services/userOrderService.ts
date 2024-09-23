import type { UserOrdersOrderType, OrderType } from '@geins/types';
import { BaseApiService, logWrite } from '@geins/core';
import { queries } from '../graphql';
import * as userOrdersParsers from '../parsers/userOrdersParsers';
import * as orderParsers from '../parsers/orderParsers';
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
    const result = await this.runQuery(queries.orders, vars);
    return this.parseResultAllOrders(result);
  }

  protected parseResultAllOrders(result: any): UserOrdersOrderType[] {
    return userOrdersParsers.parseUserOrders(result);
  }

  async getRaw(variables: any): Promise<any> {
    const vars = await this.generateVars(variables);
    return this.runQuery(queries.orders, vars);
  }

  async get(orderId: number): Promise<OrderType> {
    const vars = await this.generateVars({ orderId: orderId });
    logWrite('get order', vars);
    const result = await this.runQuery(queries.order, vars);
    logWrite('get order', result);
    return orderParsers.parseOrder(result);
  }
}
