import { BaseApiService } from '../base/baseApiService';
import { queries } from '../graphql';

export class ChannelsService extends BaseApiService {
  async getRaw() {
    // const vars = await this.generateVars(variables);
    //throw new Error('Not implemented');
    return await this.runQuery(queries.channels, {});
  }

  async get(variables: any) {
    //const vars = await this.generateVars(variables);
    throw new Error('Not implemented');
    // return await this.runQueryParsed(queries.contentArea, vars);
  }

  protected parseResult(result: any): any {
    throw new Error('Not implemented');
    // return contentParsers.parseContentArea(result);
  }
}
