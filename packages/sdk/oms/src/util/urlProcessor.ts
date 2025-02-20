import type { CheckoutRedirectsType } from '@geins/core';
import { CHECKOUT_PARAMETERS, extractParametersFromUrl } from '@geins/core';

export class UrlProcessor {
  generateParameters(currentParameters: Map<string, string>): Map<string, string> {
    const mergedMap = new Map(CHECKOUT_PARAMETERS);
    Array.from(currentParameters.entries()).forEach(([key, value]) => {
      mergedMap.set(key, value);
    });
    return mergedMap;
  }

  processUrls(redirectUrls: CheckoutRedirectsType): CheckoutRedirectsType | undefined {
    const processedUrls = { ...redirectUrls };

    Object.keys(processedUrls).forEach((key) => {
      if (key === 'success' && processedUrls[key]) {
        const { url, params } = extractParametersFromUrl(processedUrls[key]);
        const parameters = this.generateParameters(params);
        processedUrls[key] = `${url}${this.createQueryString(parameters)}`;
      }
    });

    return processedUrls;
  }

  private createQueryString(parameters: Map<string, string>): string {
    if (!parameters.size) return '';

    const queryParams = Array.from(parameters.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `?${queryParams}`;
  }
}
