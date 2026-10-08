import { readFileSync } from 'fs';
import {
  buildSchema,
  parse,
  validate,
  type DocumentNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type SelectionSetNode,
} from 'graphql';
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

  const configuredLineDocuments = [
    ...cartDocuments.map(([name]) => name).filter((name) => name !== 'orderGet'),
    'configurationAddCartItem',
    'configurationUpdateCartItem',
    'configurationGetCartLines',
    'configurationGetOrderLines',
    'configurationGetOrderLineChoices',
  ];

  it.each(documents)(
    '%s selects the committed sections only where it reads a configured line',
    (name, document) => {
      expect(fragmentNames(document).includes('CpqCommittedSections')).toBe(
        configuredLineDocuments.includes(name),
      );
    },
  );

  function fragment(name: string): FragmentDefinitionNode {
    const document = toDocument(queries.configurationGetOrderLines);
    const found = document.definitions.find(
      (d): d is FragmentDefinitionNode => d.kind === 'FragmentDefinition' && d.name.value === name,
    );
    if (!found) throw new Error(`no fragment ${name}`);
    return found;
  }

  function depthOf(node: { selectionSet?: SelectionSetNode }, field: string): number {
    const child = node.selectionSet?.selections.find(
      (s): s is FieldNode => s.kind === 'Field' && s.name.value === field,
    );
    return child ? 1 + depthOf(child, field) : 0;
  }

  it('walks sections four levels deep', () => {
    expect(depthOf(fragment('CpqCommittedSections'), 'sections')).toBe(4);
  });

  // `product` is today's catalogue price, read for every option of the cart.
  it('selects no product on a committed option', () => {
    const fields = fragment('CpqCommittedOption').selectionSet.selections.map((s) =>
      s.kind === 'Field' ? s.name.value : s.kind,
    );
    expect(fields).toEqual(expect.arrayContaining(['name', 'quantity', 'unitPrice']));
    expect(fields).not.toContain('product');
  });
});
