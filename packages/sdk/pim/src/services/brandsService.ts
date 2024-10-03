import type { BrandsQueryVariables, GeinsBrandTypeType } from '@geins/types';
import { BasePIMApiServicesService } from '../base/basePIMApiService';
import { queries } from '../graphql';
import { parseBrands } from '../parsers/brandParsers';
export class BrandsService extends BasePIMApiServicesService {
  private async generateVars(variables: BrandsQueryVariables) {
    if (
      !variables.marketId &&
      this.marketLanguage &&
      this.marketLanguage.marketId
    ) {
      variables.marketId = this.marketLanguage.marketId;
    }
    if (
      !variables.languageId &&
      this.marketLanguage &&
      this.marketLanguage.languageId
    ) {
      variables.languageId = this.marketLanguage.languageId;
    }
    const vars = this.createVariables(variables);
    return vars;
  }

  async getRaw(variables: BrandsQueryVariables): Promise<any> {
    const options = {
      query: queries.brands,
      variables: await this.generateVars(variables),
    };
    return await this.runQuery(options);
  }

  async get(variables: BrandsQueryVariables): Promise<GeinsBrandTypeType[]> {
    const options = {
      query: queries.brands,
      variables: await this.generateVars(variables),
    };
    return await this.runQueryParsed(options);
  }

  protected parseResult(result: any): GeinsBrandTypeType[] {
    if (
      !result ||
      !result.data ||
      !result.data.brands ||
      !result.data.brands.length
    ) {
      return [];
    }
    return parseBrands(result.data.brands);
  }
}
