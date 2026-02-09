import { paginate, paginateAll, PageFetcher } from '../src/utils/paginator';

describe('paginate', () => {
  it('iterates through all pages', async () => {
    const allItems = Array.from({ length: 55 }, (_, i) => ({ id: i }));

    const fetcher: PageFetcher<{ id: number }> = async (skip, take) => {
      const items = allItems.slice(skip, skip + take);
      return { items, count: allItems.length };
    };

    const pages = [];
    for await (const page of paginate(fetcher, { take: 20 })) {
      pages.push(page);
    }

    expect(pages).toHaveLength(3);
    expect(pages[0].items).toHaveLength(20);
    expect(pages[0].hasMore).toBe(true);
    expect(pages[0].skip).toBe(0);
    expect(pages[1].items).toHaveLength(20);
    expect(pages[1].hasMore).toBe(true);
    expect(pages[1].skip).toBe(20);
    expect(pages[2].items).toHaveLength(15);
    expect(pages[2].hasMore).toBe(false);
    expect(pages[2].skip).toBe(40);
    expect(pages[2].count).toBe(55);
  });

  it('handles empty result', async () => {
    const fetcher: PageFetcher<unknown> = async () => {
      return { items: [], count: 0 };
    };

    const pages = [];
    for await (const page of paginate(fetcher)) {
      pages.push(page);
    }

    expect(pages).toHaveLength(1);
    expect(pages[0].items).toHaveLength(0);
    expect(pages[0].hasMore).toBe(false);
    expect(pages[0].count).toBe(0);
  });

  it('handles single page exactly filling take', async () => {
    const fetcher: PageFetcher<number> = async (skip, take) => {
      return { items: [1, 2, 3, 4, 5], count: 5 };
    };

    const pages = [];
    for await (const page of paginate(fetcher, { take: 5 })) {
      pages.push(page);
    }

    expect(pages).toHaveLength(1);
    expect(pages[0].hasMore).toBe(false);
  });

  it('respects startSkip option', async () => {
    const allItems = Array.from({ length: 30 }, (_, i) => i);
    const fetcher: PageFetcher<number> = async (skip, take) => {
      return { items: allItems.slice(skip, skip + take), count: allItems.length };
    };

    const pages = [];
    for await (const page of paginate(fetcher, { take: 10, startSkip: 10 })) {
      pages.push(page);
    }

    expect(pages).toHaveLength(2);
    expect(pages[0].skip).toBe(10);
    expect(pages[0].items[0]).toBe(10);
  });

  it('defaults take to 20', async () => {
    let capturedTake = 0;
    const fetcher: PageFetcher<number> = async (skip, take) => {
      capturedTake = take;
      return { items: [], count: 0 };
    };

    for await (const _ of paginate(fetcher)) {
      // just iterate
    }

    expect(capturedTake).toBe(20);
  });
});

describe('paginateAll', () => {
  it('returns all items flattened', async () => {
    const allItems = Array.from({ length: 45 }, (_, i) => i);
    const fetcher: PageFetcher<number> = async (skip, take) => {
      return { items: allItems.slice(skip, skip + take), count: allItems.length };
    };

    const result = await paginateAll(fetcher, { take: 20 });
    expect(result).toHaveLength(45);
    expect(result).toEqual(allItems);
  });

  it('returns empty array for no results', async () => {
    const fetcher: PageFetcher<number> = async () => {
      return { items: [], count: 0 };
    };

    const result = await paginateAll(fetcher);
    expect(result).toEqual([]);
  });
});
