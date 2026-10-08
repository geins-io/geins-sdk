---
'@geins/types': patch
'@geins/core': patch
'@geins/cms': patch
'@geins/crm': patch
'@geins/oms': patch
---

Read a configured line's committed sections, with names and prices, in the cart, checkout and order
reads.

The cart and checkout reads (through `OmsCartItemConfiguration`), the configured-line reads
(`configuration.getCartLines`, `addCartItem`, `updateCartItem`) and the order reads
(`configuration.getOrderLines`, `getOrderLineChoices`) now select `configuration.sections`, four
levels deep, through the new `CpqCommittedSections` fragment:

- a section: `id`, `name`, `sortIndex`, its variables, option groups and nested sections
- an option group: `id`, `code`, `name`, `sortIndex`, its options and nested groups (three levels)
- an option: `id`, `instanceId`, `articleNumber`, `name`, `quantity`, `unitPrice`,
  `discountPercent`. `unitPrice` is one of the option at commit, net of its own discount. Option
  prices need not add up to the line's price. The option's `product` is not selected: it is
  today's catalogue price, and it would be read for every option of every cart.
- a variable: `id`, `name`, `sortIndex`, `valueType`, `value`, `unit`, `decimals`

`sortIndex` is passed through, and members keep the order they arrive in. Sorting (nulls last) is
the reader's job.

`CartItemConfigurationType` (a cart line, a configured cart line and an order row) gets
`sections?: CommittedConfigurationSectionType[]`, which is **absent** when the answer has `null`,
for a configuration committed before cpq recorded its structure. `summary` is unchanged and is the
fallback. `CommittedOrderLinesType` (`getOrderLineChoices`) **keeps** `sections: … | null`, as
before. The two differ on purpose, so do not change one to match the other. The committed section,
option group and variable types gain the fields above, and an option row is now
`CommittedConfigurationOptionType`. The order summary (`order.get`) is unchanged.
