import { readFileSync } from 'fs';
import { buildSchema, parse, validate, type DocumentNode } from 'graphql';
import { join } from 'path';
import checkoutQuery from '../src/graphql/checkout/get.gql';
import { queries } from '../src/graphql/queries';

const schema = buildSchema(readFileSync(join(__dirname, '../../../../schemas/schema.graphql'), 'utf8'));

// Typed as a string for the build; the jest transform hands over the parsed document.
function toDocument(source: string | DocumentNode): DocumentNode {
  return typeof source === 'string' ? parse(source) : source;
}

const documents: [string, DocumentNode][] = [
  ...Object.entries(queries).map(([name, source]): [string, DocumentNode] => [name, toDocument(source)]),
  ['checkoutQuery', toDocument(checkoutQuery)],
];

function fragmentNames(document: DocumentNode): string[] {
  return document.definitions.flatMap((d) => (d.kind === 'FragmentDefinition' ? [d.name.value] : []));
}

describe('graphql documents', () => {
  it.each(documents)('%s validates against the schema', (_name, document) => {
    expect(validate(schema, document)).toEqual([]);
  });

  it('fails validation on a field the schema does not have', () => {
    const document = parse('query { getCart { items { configurationIdd } } }');
    expect(validate(schema, document)).not.toEqual([]);
  });

  const cartDocuments = documents.filter(([, document]) => fragmentNames(document).includes('OmsCart'));

  it('covers every document that reads a cart', () => {
    expect(cartDocuments.map(([name]) => name).sort()).toEqual(
      [
        'cartAddItem',
        'cartAddPackageItem',
        'cartComplete',
        'cartCopy',
        'cartCreate',
        'cartGet',
        'cartSetMerchantData',
        'cartSetPromotionCode',
        'cartSetShippingFee',
        'cartUpdateItem',
        'cartUpdatePackageItem',
        'checkoutCreate',
        'checkoutQuery',
        'orderGet',
      ].sort(),
    );
  });

  // On an order, `configuration` is read from cpq with the order.
  it.each(cartDocuments)(
    '%s selects the line configuration on a cart and not on an order',
    (name, document) => {
      expect(fragmentNames(document).includes('OmsCartItemConfiguration')).toBe(name !== 'orderGet');
    },
  );
});
