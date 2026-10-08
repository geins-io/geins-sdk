import {
  parseCommittedConfiguration,
  parseCommittedOrderLines,
  parseConfiguration,
  parseConfiguredCartLines,
  parseConfiguredOrderLines,
} from '../src/parsers/configurationParser';

const price = {
  __typename: 'PriceType',
  sellingPriceExVat: 50.25,
  currency: { __typename: 'CurrencyType', code: 'SEK' },
};

function wireOption(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'CpqOptionType',
    id: 'o1',
    instanceId: 'i1',
    articleNumber: 'A-1',
    name: 'Option',
    description: '',
    selected: true,
    available: true,
    readOnly: false,
    selectionSource: 'MANUAL',
    quantity: '2',
    defaultQuantity: 1,
    minQuantity: null,
    maxQuantity: '10',
    unitPrice: price,
    discountPercent: '25',
    product: null,
    messages: null,
    ...overrides,
  };
}

function wireConfiguration(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'CpqConfigurationType',
    configurationId: 'c1',
    expiresAt: '2026-10-06T12:00:00Z',
    isValid: false,
    articleNumber: 'KONF-1',
    quantity: '1',
    unitPrice: price,
    discountPercent: null,
    weightPerUnit: '12.5',
    templateId: 't',
    templateVersion: '3',
    messages: [{ __typename: 'CpqMessageType', severity: 'ERROR', text: 'Missing' }, null],
    sections: [
      {
        __typename: 'CpqSectionType',
        id: 's1',
        name: 'Machine',
        description: null,
        visible: true,
        sortIndex: 0,
        messages: null,
        sections: null,
        variables: [
          {
            __typename: 'CpqVariableType',
            id: 'v1',
            name: 'Width',
            description: null,
            valueType: 'NUMBER',
            value: '1200',
            defaultValue: null,
            required: true,
            available: true,
            readOnly: false,
            min: '100',
            max: 2000,
            step: null,
            decimals: 0,
            unit: 'mm',
            selectionSource: 'INITIAL',
            valueSource: 'MANUAL',
            sortIndex: 1,
            messages: [],
          },
        ],
        optionGroups: [
          {
            __typename: 'CpqOptionGroupType',
            id: 'g1',
            code: 'G',
            name: 'Finish',
            description: null,
            available: true,
            minSelections: 1,
            maxSelections: 1,
            minQuantity: null,
            maxQuantity: null,
            quantityEditable: false,
            sortIndex: 2,
            messages: null,
            optionGroups: null,
            options: [wireOption(), null],
          },
          null,
        ],
      },
      null,
    ],
    ...overrides,
  };
}

describe('parseConfiguration', () => {
  it('turns every Decimal into a number, whether sent as a number or a string', () => {
    const doc = parseConfiguration(wireConfiguration())!;
    const option = doc.sections[0].optionGroups[0].options[0];

    expect(doc.quantity).toBe(1);
    expect(doc.weightPerUnit).toBe(12.5);
    expect(option.quantity).toBe(2);
    expect(option.maxQuantity).toBe(10);
    expect(option.discountPercent).toBe(25);
    expect(doc.sections[0].variables[0].min).toBe(100);
    expect(doc.sections[0].variables[0].max).toBe(2000);
  });

  it('keeps a missing Decimal as null and an unreadable one as null', () => {
    const doc = parseConfiguration(wireConfiguration({ discountPercent: null, weightPerUnit: 'n/a' }))!;

    expect(doc.discountPercent).toBeNull();
    expect(doc.weightPerUnit).toBeNull();
  });

  it('turns null lists into empty ones and drops null rows', () => {
    const doc = parseConfiguration(wireConfiguration())!;
    const section = doc.sections[0];

    expect(doc.sections).toHaveLength(1);
    expect(doc.messages).toEqual([{ severity: 'ERROR', text: 'Missing' }]);
    expect(section.sections).toEqual([]);
    expect(section.messages).toEqual([]);
    expect(section.optionGroups).toHaveLength(1);
    expect(section.optionGroups[0].optionGroups).toEqual([]);
    expect(section.optionGroups[0].options).toHaveLength(1);
  });

  it('keeps enum values, the variable value and a node without an id as sent', () => {
    const doc = parseConfiguration(
      wireConfiguration({
        sections: [{ ...wireConfiguration().sections[0], id: null, name: 'Hidden' }],
      }),
    )!;
    const section = doc.sections[0];

    expect(section.id).toBeNull();
    expect(section.variables[0].value).toBe('1200');
    expect(section.variables[0].valueType).toBe('NUMBER');
    expect(section.optionGroups[0].options[0].selectionSource).toBe('MANUAL');
  });

  it('strips __typename at every level, also inside prices', () => {
    const doc = parseConfiguration(wireConfiguration())!;

    expect(JSON.stringify(doc)).not.toContain('__typename');
    expect(doc.unitPrice).toEqual({ sellingPriceExVat: 50.25, currency: { code: 'SEK' } });
  });

  it('keeps the embedded product of an option', () => {
    const product = {
      __typename: 'ProductType',
      productId: 7,
      name: 'Panel',
      articleNumber: 'P-7',
      alias: 'panel',
      canonicalUrl: '/p/panel',
      productImages: [{ __typename: 'ProductImageType', fileName: 'panel.jpg' }, null],
    };
    const doc = parseConfiguration(
      wireConfiguration({
        sections: [
          {
            ...wireConfiguration().sections[0],
            optionGroups: [
              { ...wireConfiguration().sections[0]!.optionGroups[0], options: [wireOption({ product })] },
            ],
          },
        ],
      }),
    )!;

    expect(doc.sections[0].optionGroups[0].options[0].product).toEqual({
      productId: 7,
      name: 'Panel',
      articleNumber: 'P-7',
      alias: 'panel',
      canonicalUrl: '/p/panel',
      productImages: [{ fileName: 'panel.jpg' }],
    });
  });

  it.each([
    ['no configuration id', { configurationId: null }],
    ['no expiry', { expiresAt: undefined }],
  ])('answers null for a document with %s', (_label, overrides) => {
    expect(parseConfiguration(wireConfiguration(overrides))).toBeNull();
  });

  it('answers null for a null document', () => {
    expect(parseConfiguration(null)).toBeNull();
    expect(parseConfiguration(undefined)).toBeNull();
  });
});

describe('parseCommittedConfiguration', () => {
  it('reads the frozen record and its summary', () => {
    expect(
      parseCommittedConfiguration({
        __typename: 'CpqCommittedConfigurationType',
        committedConfigurationId: 'k1',
        configurationId: null,
        articleNumber: 'KONF-1',
        quantity: '3',
        unitPrice: null,
        discountPercent: '0',
        weightPerUnit: null,
        summary: [
          { __typename: 'CpqCommittedConfigurationLineType', label: 'Width', value: '1200 mm' },
          null,
        ],
      }),
    ).toEqual({
      committedConfigurationId: 'k1',
      configurationId: null,
      articleNumber: 'KONF-1',
      quantity: 3,
      unitPrice: null,
      discountPercent: 0,
      weightPerUnit: null,
      summary: [{ label: 'Width', value: '1200 mm' }],
    });
  });

  it('answers null for a record without a committed id', () => {
    expect(parseCommittedConfiguration({ committedConfigurationId: null, summary: [] })).toBeNull();
  });

  it('answers null for a null record', () => {
    expect(parseCommittedConfiguration(null)).toBeNull();
  });
});

describe('parseConfiguredCartLines', () => {
  it('reads each line, configured or not, and drops null rows', () => {
    expect(
      parseConfiguredCartLines({
        __typename: 'CartType',
        id: 'cart',
        items: [
          {
            __typename: 'CartItemType',
            id: 'a',
            quantity: 2,
            configurationId: 'k1',
            configuration: { summary: [{ label: 'Width', value: '1200 mm' }] },
          },
          { id: 'b', quantity: 1, configurationId: null, configuration: null },
          null,
        ],
      }),
    ).toEqual({
      id: 'cart',
      items: [
        {
          id: 'a',
          quantity: 2,
          configurationId: 'k1',
          configuration: { summary: [{ label: 'Width', value: '1200 mm' }] },
        },
        { id: 'b', quantity: 1, configurationId: null, configuration: null },
      ],
    });
  });

  it('answers null for a null cart and an empty list for null items', () => {
    expect(parseConfiguredCartLines(null)).toBeNull();
    expect(parseConfiguredCartLines({ id: 'c', items: null })).toEqual({ id: 'c', items: [] });
  });
});

describe('parseConfiguredOrderLines', () => {
  it('keeps a null row in its place, so positions match the order', () => {
    const lines = parseConfiguredOrderLines({
      cart: {
        items: [
          null,
          { product: { productId: 7, type: 'configurable' }, configuration: { summary: null } },
          { product: null, configuration: null },
        ],
      },
    });

    expect(lines).toEqual({
      items: [
        null,
        { product: { productId: 7, type: 'configurable' }, configuration: { summary: [] } },
        { product: null, configuration: null },
      ],
    });
  });

  it('answers null for a null order and no rows for an order without a cart', () => {
    expect(parseConfiguredOrderLines(null)).toBeNull();
    expect(parseConfiguredOrderLines({ cart: null })).toEqual({ items: [] });
  });
});

// The committed structure as a configured line carries it, shaped like a live answer.
function wireCommittedSections() {
  return [
    {
      __typename: 'CpqCommittedSectionType',
      id: 's1',
      name: 'Additional Options',
      sortIndex: 14,
      variables: [
        {
          __typename: 'CpqCommittedVariableType',
          id: 'v1',
          name: 'Width (500-1500)',
          sortIndex: 6,
          valueType: 'NUMBER',
          value: '1200',
          unit: 'mm',
          decimals: 0,
        },
        null,
      ],
      optionGroups: [
        {
          __typename: 'CpqCommittedOptionGroupType',
          id: 'g1',
          code: 'TEETH',
          name: 'Teeth',
          sortIndex: 15,
          options: [
            {
              __typename: 'CpqCommittedOptionType',
              id: 'o1',
              instanceId: '0',
              articleNumber: 'J250',
              name: 'J250 Bucket Teeth 7-14t',
              quantity: '4',
              unitPrice: price,
              discountPercent: '0',
            },
            null,
          ],
          optionGroups: [
            {
              id: 'g2',
              code: null,
              name: 'Wear bars',
              sortIndex: null,
              options: [
                {
                  id: 'o2',
                  instanceId: '0',
                  articleNumber: null,
                  name: 'Wear bar profile 8x80',
                  quantity: 5.73,
                  unitPrice: null,
                  discountPercent: null,
                },
              ],
              optionGroups: null,
            },
          ],
        },
      ],
      sections: [
        { id: 's2', name: 'Nested', sortIndex: null, variables: null, optionGroups: null, sections: null },
      ],
    },
    null,
  ];
}

const committedSections = [
  {
    id: 's1',
    name: 'Additional Options',
    sortIndex: 14,
    variables: [
      {
        id: 'v1',
        name: 'Width (500-1500)',
        sortIndex: 6,
        valueType: 'NUMBER',
        value: '1200',
        unit: 'mm',
        decimals: 0,
      },
    ],
    optionGroups: [
      {
        id: 'g1',
        code: 'TEETH',
        name: 'Teeth',
        sortIndex: 15,
        options: [
          {
            id: 'o1',
            instanceId: '0',
            articleNumber: 'J250',
            name: 'J250 Bucket Teeth 7-14t',
            quantity: 4,
            unitPrice: { sellingPriceExVat: 50.25, currency: { code: 'SEK' } },
            discountPercent: 0,
          },
        ],
        optionGroups: [
          {
            id: 'g2',
            code: null,
            name: 'Wear bars',
            sortIndex: null,
            options: [
              {
                id: 'o2',
                instanceId: '0',
                articleNumber: null,
                name: 'Wear bar profile 8x80',
                quantity: 5.73,
                unitPrice: null,
                discountPercent: null,
              },
            ],
            optionGroups: [],
          },
        ],
      },
    ],
    sections: [{ id: 's2', name: 'Nested', sortIndex: null, variables: [], optionGroups: [], sections: [] }],
  },
];

describe('committed sections on a configured line', () => {
  const summary = [{ label: 'Width', value: '1200 mm' }];

  it('reads the sections of a cart line at depth, with names, sort indexes and option prices', () => {
    const lines = parseConfiguredCartLines({
      id: 'cart',
      items: [
        {
          id: 'a',
          quantity: 1,
          configurationId: 'k1',
          configuration: { summary, sections: wireCommittedSections() },
        },
      ],
    });
    expect(lines!.items[0].configuration).toStrictEqual({ summary, sections: committedSections });
  });

  it('reads the sections of an order row', () => {
    const lines = parseConfiguredOrderLines({
      cart: {
        items: [
          {
            product: { productId: 7, type: 'configurable' },
            configuration: { summary, sections: wireCommittedSections() },
          },
        ],
      },
    });
    expect(lines!.items[0]!.configuration).toStrictEqual({ summary, sections: committedSections });
  });

  it('leaves sections out for a configuration committed before the structure was recorded, keeping the summary', () => {
    const cart = parseConfiguredCartLines({
      id: 'cart',
      items: [{ id: 'a', quantity: 1, configurationId: 'k1', configuration: { summary, sections: null } }],
    });
    const order = parseConfiguredOrderLines({
      cart: { items: [{ product: null, configuration: { summary, sections: null } }] },
    });
    expect(cart!.items[0].configuration).toStrictEqual({ summary });
    expect(order!.items[0]!.configuration).toStrictEqual({ summary });
  });

  it('leaves sections out when the document does not select them', () => {
    const lines = parseConfiguredCartLines({ id: 'cart', items: [{ id: 'a', configuration: { summary } }] });
    expect(lines!.items[0].configuration).toStrictEqual({ summary });
  });

  it('keeps an empty structure as an empty list', () => {
    const lines = parseConfiguredCartLines({
      id: 'cart',
      items: [{ id: 'a', configuration: { summary: [], sections: [] } }],
    });
    expect(lines!.items[0].configuration).toStrictEqual({ summary: [], sections: [] });
  });

  it('keeps the order the members arrive in and passes sortIndex through unsorted', () => {
    const section = (id: string, sortIndex: number | null) => ({
      id,
      name: id,
      sortIndex,
      variables: null,
      optionGroups: null,
      sections: null,
    });
    const lines = parseConfiguredCartLines({
      id: 'cart',
      items: [
        {
          id: 'a',
          configuration: { summary: [], sections: [section('c', 14), section('a', null), section('b', 2)] },
        },
      ],
    });
    expect(lines!.items[0].configuration!.sections!.map((s) => [s.id, s.sortIndex])).toEqual([
      ['c', 14],
      ['a', null],
      ['b', 2],
    ]);
  });
});

describe('parseCommittedOrderLines', () => {
  it('reads names, sort indexes and option prices when the document selects them', () => {
    const lines = parseCommittedOrderLines({
      cart: { items: [{ product: { productId: 7 }, configuration: { sections: wireCommittedSections() } }] },
    });
    expect(lines!.items[0]).toStrictEqual({
      product: { productId: 7 },
      configuration: { sections: committedSections },
    });
  });

  it('reads the committed structure at depth, keeping positions', () => {
    const lines = parseCommittedOrderLines({
      cart: {
        items: [
          null,
          {
            product: { productId: 7 },
            configuration: {
              sections: [
                {
                  id: 's1',
                  variables: [{ id: 'v1', valueType: 'NUMBER', value: '1200' }, null],
                  optionGroups: [
                    {
                      id: 'g1',
                      options: [{ id: 'o1', instanceId: 'i1', quantity: '2' }],
                      optionGroups: [{ id: 'g2', options: null, optionGroups: null }],
                    },
                  ],
                  sections: [{ id: 's2', variables: null, optionGroups: null, sections: null }],
                },
              ],
            },
          },
        ],
      },
    });

    expect(lines!.items[0]).toBeNull();
    expect(lines!.items[1]).toEqual({
      product: { productId: 7 },
      configuration: {
        sections: [
          {
            id: 's1',
            name: null,
            sortIndex: null,
            variables: [
              {
                id: 'v1',
                name: null,
                sortIndex: null,
                valueType: 'NUMBER',
                value: '1200',
                unit: null,
                decimals: null,
              },
            ],
            optionGroups: [
              {
                id: 'g1',
                code: null,
                name: null,
                sortIndex: null,
                options: [
                  {
                    id: 'o1',
                    instanceId: 'i1',
                    articleNumber: null,
                    name: null,
                    quantity: 2,
                    unitPrice: null,
                    discountPercent: null,
                  },
                ],
                optionGroups: [
                  { id: 'g2', code: null, name: null, sortIndex: null, options: [], optionGroups: [] },
                ],
              },
            ],
            sections: [
              { id: 's2', name: null, sortIndex: null, variables: [], optionGroups: [], sections: [] },
            ],
          },
        ],
      },
    });
  });

  it('keeps sections null for a row committed before the structure was recorded', () => {
    expect(
      parseCommittedOrderLines({
        cart: { items: [{ product: { productId: 7 }, configuration: { sections: null } }] },
      }),
    ).toEqual({ items: [{ product: { productId: 7 }, configuration: { sections: null } }] });
  });

  it('keeps a plain row as a null configuration', () => {
    expect(
      parseCommittedOrderLines({ cart: { items: [{ product: { productId: 7 }, configuration: null }] } }),
    ).toEqual({ items: [{ product: { productId: 7 }, configuration: null }] });
  });
});
