export interface PaginatedResult<T> {
  items: T[];
  count: number;
  hasMore: boolean;
  skip: number;
  take: number;
}

export interface PaginateOptions {
  take?: number;
  startSkip?: number;
}

export type PageFetcher<T> = (skip: number, take: number) => Promise<{ items: T[]; count: number }>;

/**
 * Creates an async iterable that auto-paginates through a skip/take API.
 *
 * @example
 * ```typescript
 * const pages = paginate<Product>(async (skip, take) => {
 *   const result = await graphql.query({
 *     query: productsQuery,
 *     variables: { skip, take, channelId, languageId, marketId },
 *   });
 *   return { items: result.products.products, count: result.products.count };
 * }, { take: 20 });
 *
 * for await (const page of pages) {
 *   console.log(`Got ${page.items.length} of ${page.count}`);
 * }
 * ```
 */
export async function* paginate<T>(
  fetcher: PageFetcher<T>,
  options: PaginateOptions = {},
): AsyncGenerator<PaginatedResult<T>> {
  const take = options.take ?? 20;
  let skip = options.startSkip ?? 0;

  while (true) {
    const { items, count } = await fetcher(skip, take);
    const hasMore = skip + items.length < count;

    yield { items, count, hasMore, skip, take };

    if (!hasMore || items.length === 0) break;
    skip += items.length;
  }
}

/**
 * Fetches all pages and returns a flat array of all items.
 *
 * @example
 * ```typescript
 * const allProducts = await paginateAll<Product>(async (skip, take) => {
 *   const result = await graphql.query({
 *     query: productsQuery,
 *     variables: { skip, take, channelId, languageId, marketId },
 *   });
 *   return { items: result.products.products, count: result.products.count };
 * }, { take: 50 });
 * ```
 */
export async function paginateAll<T>(
  fetcher: PageFetcher<T>,
  options: PaginateOptions = {},
): Promise<T[]> {
  const all: T[] = [];
  for await (const page of paginate(fetcher, options)) {
    all.push(...page.items);
  }
  return all;
}
